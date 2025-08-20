require("@dotenvx/dotenvx").config()


module.exports = {
    PORT: process.env.PORT,
    FRONTEND_URL: process.env.FRONTEND_URL,
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    //  JWT configuration
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
    RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET,
    RESET_TOKEN_EXPIRATION: process.env.RESET_TOKEN_EXPIRATION,
    // Nodemailer configuration
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}