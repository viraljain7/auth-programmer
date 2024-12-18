import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpiresAt: {
        type: Date,
        default: null
    },
    verificationToken: {
        type: String,
        default: null
    },
    verificationTokenExpiresAt: {
        type: Date,
        default: null
    }


}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;