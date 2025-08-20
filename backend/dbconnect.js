const mongoose = require('mongoose');
const { MONGODB_CONNECTION_STRING } = require('./config/dotenvx');

async function connectToDatabase() {
    await mongoose.connect(MONGODB_CONNECTION_STRING, {
    })
        .then(() => {
            console.log('Connected to MongoDB successfully: ', MONGODB_CONNECTION_STRING.split('/')[2]);
        })
        .catch(err => {
            console.error('Error connecting to MongoDB:', err);
            process.exit(1); // Exit the process with failure
        });
}

module.exports = connectToDatabase;
