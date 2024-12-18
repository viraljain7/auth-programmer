import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetToken from '../libs/generateTokenAndSetToken.js';


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

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
const logout = async (req, res) => { }

export { signup, login, logout };