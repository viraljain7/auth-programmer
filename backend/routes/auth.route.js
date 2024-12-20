import express from 'express';
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

export const authRoutes = express.Router();



// Register route
authRoutes.post('/signup', signup);

// // Login route
authRoutes.post('/login', login);

// // Logout route
authRoutes.post('/logout', logout);

// // verify email route
authRoutes.post('/verify-email', verifyEmail);

// // forgot password route
authRoutes.post('/forgot-password', forgotPassword);

// // reset password route
authRoutes.post('/reset-password/:token', resetPassword);
