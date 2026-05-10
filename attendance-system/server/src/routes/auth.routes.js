const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const generateCode = require('../utils/generateCode');

const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedRoles = ['ADMIN', 'VOLUNTEER', 'MEMBER'];

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let accessCode;
        let codeExists = true;
        while (codeExists) {
            accessCode = generateCode();
            const existingCode = await User.findOne({ accessCode });
            codeExists = !!existingCode;
        }

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            accessCode
        });

        await user.save();

        return res.json({ message: 'User registered successfully', accessCode });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { accessCode, password } = req.body;

        if (!accessCode || !password) {
            return res.status(400).json({ error: 'Access code and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const user = await User.findOne({ accessCode });
        if (!user) {
            return res.status(401).json({ error: 'Invalid code or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid code or password' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'JWT secret not configured' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const userObj = user.toObject();
        delete userObj.password;

        return res.json({ token, user: userObj });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
