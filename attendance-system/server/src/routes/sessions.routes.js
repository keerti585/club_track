const express = require('express');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const Session = require('../models/Session.model');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

const requireRoles = roles => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
};

router.get('/active/current', async (req, res) => {
    try {
        const session = await Session.findOne({ status: 'ACTIVE' });
        return res.json({ session });
    } catch (error) {
        console.error('Get active session error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.post('/create', authMiddleware, requireRoles(['ADMIN']), async (req, res) => {
    try {
        const { title, date, venue, type } = req.body;

        if (!title || !date || !venue || !type) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const session = await Session.create({
            title,
            date,
            venue,
            type,
            status: 'DRAFT'
        });

        return res.status(201).json(session);
    } catch (error) {
        console.error('Create session error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 });
        return res.json(sessions);
    } catch (error) {
        console.error('Get sessions error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        return res.json(session);
    } catch (error) {
        console.error('Get session error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.patch('/:id/status', authMiddleware, requireRoles(['ADMIN', 'VOLUNTEER']), async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['DRAFT', 'ACTIVE', 'CLOSED'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const session = await Session.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        return res.json(session);
    } catch (error) {
        console.error('Update status error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id/qr', authMiddleware, requireRoles(['ADMIN', 'VOLUNTEER']), async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session.status !== 'ACTIVE') {
            return res.status(400).json({ error: 'Session must be ACTIVE to generate QR' });
        }

        const secret = process.env.JWT_SECRET || 'fallback_secret_key_123';
        const signedToken = jwt.sign(
            { sessionId: session._id.toString(), type: 'attendance' },
            secret,
            { expiresIn: '10m' }
        );

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const scanUrl = `${clientUrl}/scan?sessionId=${session._id}&token=${signedToken}`;
        const qrCode = await QRCode.toDataURL(scanUrl);

        return res.json({
            qrCode,
            scanUrl,
            expiresAt: Date.now() + 10 * 60 * 1000
        });
    } catch (error) {
        console.error('Generate QR error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
