const User = require('../model/user.model');
const RefreshToken = require('../model/token.model');
const { BCRYPT_SALT_ROUNDS } = require('../config/dotenvx');
const bcrypt = require('bcrypt');
const { validateRegistration, validateUpdateName, validateUpdateUser, validatePassword } = require('../validators/user.validator');
const JWTService = require('../services/JWT.service');
const hasBlankPassword = require('../middlewares/hasBlankPassword');
const { sendLoginNotificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordChangedNotificationEmail } = require('./email.controller');
const { FRONTEND_URL } = require('../config/dotenvx');
const NoteService = require('../services/note.service');

const UserController = {
    async createUserUsingEmail(req, res) {
        try {
            const { fname, lname, email, password, streetAddress, city, country } = req.body;

            // validate required fields
            const { error } = validateRegistration(req.body);

            if (error) {
                const errorsMessages = error.details.map(err => err.message);
                return res.status(400).json({ message: 'Validation error', errors: errorsMessages });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, parseInt(BCRYPT_SALT_ROUNDS));

            // Create new user & Generate JWT token

            let accessToken, refreshToken;
            let newUser;

            try {
                newUser = new User({
                    fname,
                    lname,
                    email,
                    password: hashedPassword,
                    streetAddress,
                    city,
                    country
                });


                accessToken = JWTService.signAccessToken({ userId: newUser._id });
                refreshToken = JWTService.signRefreshToken({ userId: newUser._id });

                // Save the new user to the database
                await newUser.save();

                // Create a welcome note for the user
                NoteService.WelcomeNote(newUser);

                // Store the refresh token in the database
                await JWTService.storeRefreshToken(newUser._id, refreshToken);

            } catch (error) {
                console.error('Error creating user:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }


            // Set cookies for access and refresh tokens
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: 3600 * 1000 // 1 hour
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: 3600 * 1000 * 24 * 7 // 7 days
            });


            // Exclude password from response
            newUser.password = undefined;

            // Send welcome email
            sendWelcomeEmail(newUser);

            res.status(201).json({
                message: 'User created successfully',
                auth: true,
                user: newUser
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async authUserUsingGoogle(req, res) {
        try {
            // get data from request body
            // no need to validate 
            // fill missing fields with default values
            // save user to database
            // generate JWT tokens and store refresh token 
            // set cookies for access and refresh tokens
            // return response with user data
            console.log(">>>:\tCreating User with Google!");

            const { fname, lname, email, registerThrough } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                // User already exists, generate JWT tokens
                const accessToken = JWTService.signAccessToken({ userId: existingUser._id });
                const refreshToken = JWTService.signRefreshToken({ userId: existingUser._id });
                // Store the refresh token in the database
                try {
                    await RefreshToken.updateOne(
                        { userId: existingUser._id },
                        { token: refreshToken },
                        { upsert: true } // Create a new document if it doesn't exist
                    )
                } catch (error) {
                    console.error('Error storing refresh token:', error);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                // Set cookies for access and refresh tokens
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    sameSite: 'None', // Allow cross-site requests
                    secure: true, // Uncomment this line if using HTTPS in production
                    maxAge: 3600 * 1000 // 1 hour
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: 'None', // Allow cross-site requests
                    secure: true, // Uncomment this line if using HTTPS in production
                    maxAge: 3600 * 1000 * 24 * 7 // 7 days
                });

                // Exclude password from response
                existingUser.password = undefined;

                // Send login notification email
                sendLoginNotificationEmail(existingUser);

                return res.status(200).json({
                    message: 'User authenticated successfully',
                    auth: true,
                    user: existingUser
                });
            }


            //*** If user does not exist, create a new user
            let accessToken, refreshToken;
            let newUser;

            try {
                // Fill missing fields with default values
                newUser = new User({
                    fname,
                    lname,
                    email,
                    password: "",
                    registerThrough,
                    streetAddress: "",
                    city: "",
                    country: ""
                });

                // Generate JWT tokens and store refresh token
                accessToken = JWTService.signAccessToken({ userId: newUser._id });
                refreshToken = JWTService.signRefreshToken({ userId: newUser._id });
                // Save user to database
                await newUser.save();

                // Create a welcome note for the user
                NoteService.WelcomeNote(newUser);

                // Store the refresh token in the database
                await JWTService.storeRefreshToken(newUser._id, refreshToken);
            }
            catch (error) {
                console.error('Error creating user with Google:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            // Set cookies for access and refresh tokens
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: 3600 * 1000 // 1 hour
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: 3600 * 1000 * 24 * 7 // 7 days
            });

            // Exclude password from response
            newUser.password = undefined;

            // Send welcome email to the new google user
            sendWelcomeEmail(newUser);

            res.status(201).json({
                message: 'User created successfully',
                auth: true,
                user: newUser
            });

        } catch (error) {
            console.error('Error creating user with Google:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            // Validate required fields
            const { error } = validateRegistration(req.body);
            if (error) {
                const errorsMessages = error.details.map(err => err.message);
                return res.status(400).json({ message: 'Validation error', errors: errorsMessages });
            }

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // If user registered through Google, do not allow login with password
            if (user.registerThrough === 'google' && user.password === "") {
                return res.status(401).json({ message: 'Login with Google is required' });
            }

            // Check if password is correct
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Exclude password from response
            user.password = undefined;

            // Generate JWT tokens
            const accessToken = JWTService.signAccessToken({ userId: user._id });
            const refreshToken = JWTService.signRefreshToken({ userId: user._id });

            // Store the refresh token in the database
            try {
                await RefreshToken.updateOne(
                    { userId: user._id },
                    { token: refreshToken },
                    { upsert: true } // Create a new document if it doesn't exist
                )
            } catch (error) {
                console.error('Error storing refresh token:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Set cookies for access and refresh tokens
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: 3600 * 1000 // 1 hour
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: 3600 * 1000 * 24 * 7 // 7 days
            });

            // Send login notification email
            sendLoginNotificationEmail(user);

            res.status(200).json({
                message: 'Login successful',
                auth: true,
                user
            });

        } catch (error) {
            console.error('Error Login user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    ,
    async logoutUser(req, res) {
        try {

            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                return res.status(400).json({ message: 'No User Logged In' });
            }

            // Verify the refresh token and Delete it
            try {
                await RefreshToken.deleteOne({ token: refreshToken });
            } catch (error) {
                console.error('Error deleting refresh token:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Clear cookies
            res.clearCookie('accessToken', {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: new Date(0)
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: new Date(0)
            });

            res.status(200).json({
                message: 'Logout successful',
                auth: false
            });
        } catch (error) {
            console.error('Error logging out user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    },

    async refreshUser(req, res) {

        // 1. get refreshToken from cookies
        // 2. verify refreshToken
        // 3. generate new tokens
        // 4. update db, return response
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                return res.status(400).json({ message: 'No User Logged In' });
            }

            // Verify the refresh token
            const payload = JWTService.verifyRefreshToken(refreshToken);
            if (!payload) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }

            // Generate new access and refresh tokens
            const newAccessToken = JWTService.signAccessToken({ userId: payload.userId });
            const newRefreshToken = JWTService.signRefreshToken({ userId: payload.userId });

            // Update the refresh token in the database
            await RefreshToken.updateOne(
                { userId: payload.userId },
                { token: newRefreshToken },
                { upsert: true } // Create a new document if it doesn't exist
            );

            // Set cookies for new tokens
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: 3600 * 1000 // 1 hour
            });
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: 3600 * 1000 * 24 * 7 // 7 days
            });

            const user = await User.findById(payload.userId).select('-password'); // Exclude password from response
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                message: 'Tokens refreshed successfully',
                auth: true,
                user
            });
        } catch (error) {
            console.error('Error refreshing user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // *** User Management Functions ***
    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId).select('-password'); // Exclude password from response
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User fetched successfully', user });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async hasNoPassword(req, res) {
        try {
            const userId = req.params.id;
            const hasNoPassword = await hasBlankPassword(userId);

            if (hasNoPassword === null) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ hasNoPassword });
        } catch (error) {
            console.error('Error checking user password:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async changePassword(req, res) {
        try {
            // check if user has blank password
            const userId = req.params.id;
            const { oldPassword, newPassword, confirmPassword } = req.body;
            console.log(">>:Request Body:", req.body);
            const hasNoPassword = await hasBlankPassword(userId);

            if (hasNoPassword === null) {
                return res.status(404).json({ message: 'User not found' });
            }
            // validate new password
            const { error } = validatePassword(req.body);
            if (error) {
                const errorsMessages = error.details.map(err => err.message);
                return res.status(400).json({
                    message: 'Validation error', errors: errorsMessages
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const oldHashedPassword = await bcrypt.hash(oldPassword, parseInt(BCRYPT_SALT_ROUNDS));
            const newHashedPassword = await bcrypt.hash(newPassword, parseInt(BCRYPT_SALT_ROUNDS));
            const newPasswordsMatched = newPassword === confirmPassword;


            //** New User Password
            if (hasNoPassword && newPasswordsMatched) {
                // if user has blank password, update with new password
                // Update the user's password
                user.password = newHashedPassword;
                await user.save();
                res.status(200).json({ message: 'Password changed successfully' });

            }
            // ** Existing User Password
            else if (!hasNoPassword && newPasswordsMatched) {
                // if user has no blank password, match with old password

                // Check if old password matches
                const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
                if (!isOldPasswordValid) {
                    return res.status(401).json({ message: 'Invalid old password' });
                }

                // Update the user's password
                user.password = newHashedPassword;
                await user.save();

                res.status(200).json({ message: 'Password changed successfully' });
            }
            else if (!newPasswordsMatched) {
                return res.status(400).json({ message: 'New password and confirm password do not match' });
            }

            // Send password changed notification email
            sendPasswordChangedNotificationEmail(user);
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ message: 'Internal server error' });

        }
    },

    async resetPasswordEmail(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // genereate reset password link
            const resetToken = JWTService.signResetToken({ userId: user._id });
            const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;
            sendPasswordResetEmail(user, resetLink);
            res.status(200).json({ message: 'Reset password email sent successfully!' });

        } catch (error) {
            console.error('Error in reset password:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    },
    async resetPassword(req, res) {
        try {
            console.log("\n\n\n>>>: Reset Password Request token:", req.params.token);
            console.log(">>>: Reset Password Request Body:", req.body);

            const { token } = req.params;
            const { newPassword, confirmPassword } = req.body;

            const newPasswordsMatched = newPassword === confirmPassword;
            if (!newPasswordsMatched) {
                return res.status(400).json({ message: 'New password and confirm password do not match' });
            }

            // Verify the reset token
            const isValidToken = JWTService.verifyResetToken(token);
            if (!isValidToken) {
                return res.status(401).json({ message: 'Invalid or expired reset token' });
            }

            // Find the user by ID
            const user = await User.findById(isValidToken.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, parseInt(BCRYPT_SALT_ROUNDS));
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error('Error in reset password:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    },

    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const updates = req.body;

            // Validate required fields
            const { error } = validateUpdateUser(updates);
            if (error) {
                const errorsMessages = error.details.map(err => err.message);
                return res.status(400).json({
                    message: 'Validation error', errors: errorsMessages
                });
            }

            // Find user and update
            if ('password' in updates) {
                delete updates.password;
            }
            const user = await User.findByIdAndUpdate(userId, updates, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Exclude password from response
            user.password = undefined;
            // Return updated user
            res.status(200).json({ message: 'User updated successfully', user, auth: true });

        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            // check if user exists and delete
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // delete its refresh token
            await RefreshToken.deleteOne({ userId: user._id });
            // Clear cookies
            res.clearCookie('accessToken', {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: new Date(0)
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: 'None', // Allow cross-site requests
                secure: true, // Uncomment this line if using HTTPS in production
                maxAge: new Date(0)
            });
            // Return success response
            res.status(200).json({ message: 'User deleted successfully', auth: false });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = UserController;