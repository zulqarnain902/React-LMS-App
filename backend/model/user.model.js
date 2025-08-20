const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    fname: {
        type: String,
        trim: true
    },
    lname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
    },
    registerThrough: {
        type: String,
        enum: ['google', 'email'],
        default: 'email'
    },
    streetAddress: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    }
},
    {
        timestamps: true
    }
);


const userModel = mongoose.model("User", userSchema, "users");

module.exports = userModel;