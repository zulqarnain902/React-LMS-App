
const User = require('../model/user.model');

const hasBlankPassword = async (userId) => {
    try {
        const user = await User.findById(userId).select('password');
        if (!user) {
            return null;
        }
        const hasNoPassword = !user.password || user.password === '';
        return hasNoPassword;
    } catch (error) {
        console.error('Error checking user password:', error);
        throw error;
    }
}

module.exports = hasBlankPassword;