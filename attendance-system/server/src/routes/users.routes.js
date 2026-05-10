const express = require('express');
const bcrypt = require('bcryptjs');
const Attendance = require('../models/Attendance.model');
const Session = require('../models/Session.model');
const User = require('../models/User.model');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

const requireRoles = roles => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
};

const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

router.get('/', authMiddleware, requireRoles(['ADMIN', 'VOLUNTEER']), async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['MEMBER', 'VOLUNTEER'] } })
            .select('-password')
            .sort({ name: 1 })
            .lean();

        return res.json({ users, count: users.length });
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.post('/create', authMiddleware, requireRoles(['ADMIN']), async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Member already exists' });
        }

        const password = await bcrypt.hash('changeme123', 10);
        const user = await User.create({
            name,
            email,
            password,
            role: 'MEMBER'
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.json({ message: 'Member added successfully', user: userResponse });
    } catch (error) {
        console.error('Create user error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', authMiddleware, requireRoles(['ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Member not found' });
        }

        if (user.role === 'ADMIN') {
            return res.status(400).json({ error: 'Cannot delete admin account' });
        }

        await Attendance.deleteMany({ userId: user._id });
        await user.deleteOne();

        return res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', authMiddleware, requireRoles(['ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Member not found' });
        }

        if (email) {
            if (!isValidEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            user.email = email;
        }

        if (name) {
            user.name = name;
        }

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.json({ message: 'Member updated', user: userResponse });
    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/session/:sessionId', authMiddleware, requireRoles(['ADMIN', 'VOLUNTEER']), async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await Session.findById(sessionId).select('_id');
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const members = await User.find({ role: 'MEMBER' })
            .select('-password')
            .sort({ name: 1 })
            .lean();

        const attendance = await Attendance.find({ sessionId })
            .select('userId method markedAt')
            .lean();

        const attendanceMap = new Map(
            attendance.map(record => [record.userId.toString(), record])
        );

        const responseMembers = members.map(member => {
            const record = attendanceMap.get(member._id.toString());
            return {
                _id: member._id,
                name: member.name,
                email: member.email,
                role: member.role,
                createdAt: member.createdAt,
                isPresent: Boolean(record),
                attendanceId: record?._id || null,
                method: record?.method || null,
                markedAt: record?.markedAt || null
            };
        });

        const presentCount = responseMembers.filter(member => member.isPresent).length;

        return res.json({
            members: responseMembers,
            presentCount,
            totalCount: responseMembers.length
        });
    } catch (error) {
        console.error('Session members error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
