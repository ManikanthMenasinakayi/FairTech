const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// We import the entire object first
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['creator', 'admin'],
        default: 'creator'
    },
    trustScore: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * FIXED PLUGIN CALL:
 * If the import is an object, we use the function inside it.
 * Otherwise, we use the function directly.
 */
const pluginFunction = (typeof passportLocalMongoose === 'function') 
    ? passportLocalMongoose 
    : passportLocalMongoose.default;

userSchema.plugin(pluginFunction, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);
module.exports = User;