import express from 'express';
import { login, logout, signup, verifyEmail } from '../controllers/auth.controller.js';

export const authRoutes = express.Router();



// Register route
authRoutes.post('/signup', signup);

// // Login route
authRoutes.post('/login', login);

// // Logout route
authRoutes.post('/logout', logout);

// // verify email route
authRoutes.post('/verify-email', verifyEmail);
