import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetToken from '../libs/generateTokenAndSetToken.js';
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/emails.js';
import crypto from 'crypto';
import { configDotenv } from 'dotenv';
configDotenv();

const signup = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            throw new Error('All fields are required');
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            name,
            password: hashedPassword,
            email,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24 hour
        });
        await newUser.save();

        generateTokenAndSetToken(res, newUser._id);

        await sendVerificationEmail(newUser.email, verificationToken);

        res.status(201).json({
            success: true, message: 'User registered successfully', user: {
                ...newUser._doc,
                password: undefined
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {

        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, error: 'Invalid username or password' });
        }
        generateTokenAndSetToken(res, user._id);
        user.lastLogin = Date.now();
        await user.save();
        res.status(200).json({
            success: true,
            message: "Loginsuccessfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
}

const forgotPassword = async (req, res) => {


    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();
        const url = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

        // send email
        await sendPasswordResetEmail(user.email, url);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

const resetPassword = async (req, res) => {
    console.log('resetPassword');

    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // update password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
export { signup, login, logout, verifyEmail, forgotPassword, resetPassword };