const express = require('express');
const UserController = require('../controllers/user.controller');
const authenticateUser = require('../middlewares/authenticateUser.middleware');
const router = express.Router();


router.post('/register', UserController.createUserUsingEmail);
router.post('/auth/google', UserController.authUserUsingGoogle);
router.post('/login', UserController.loginUser);
router.post('/logout', authenticateUser, UserController.logoutUser);
router.get('/refresh', UserController.refreshUser);


router.get("/hasnopassword/:id", authenticateUser, UserController.hasNoPassword);
router.put('/change-password/:id', authenticateUser, UserController.changePassword);
router.post('/reset-password-email', UserController.resetPasswordEmail);
router.post('/reset-password/:token', UserController.resetPassword);

// router.get("/:id", authenticateUser, UserController.getUserById);
router.patch("/update/:id", authenticateUser, UserController.updateUser);
router.delete("/delete/:id", authenticateUser, UserController.deleteUser);

module.exports = router;
