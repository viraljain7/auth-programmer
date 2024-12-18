import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';

export const authRoutes = express.Router();


authRoutes.get('/', (req, res) => {
    res.send('Hello Worldd!!!');
});
// Register route
authRoutes.post('/signup', signup);

// // Login route
authRoutes.post('/login', login);

// // Logout route
authRoutes.post('/logout', logout);
