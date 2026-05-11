const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

router.post('/scan', async (req, res) => {
    try {
        const { sessionId, token, name, email } = req.body;

        if (!sessionId || !token || !name || !email) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        if (decoded.type !== 'attendance' || decoded.sessionId !== sessionId) {
            return res.status(400).json({ error: 'Invalid token payload' });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            const guestPassword = await bcrypt.hash(Math.random().toString(36), 10);
            user = await User.create({
                name,
                email,
                password: guestPassword,
                role: 'MEMBER'
            });
        }

        const existingAttendance = await Attendance.findOne({
            userId: user._id,
            sessionId
        });

        if (existingAttendance) {
            return res.status(400).json({ error: 'Attendance already marked' });
        }

        await Attendance.create({
            userId: user._id,
            sessionId,
            method: 'QR'
        });

        return res.json({ message: 'Attendance marked successfully', name: user.name });
    } catch (error) {
        console.error('Scan attendance error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.post('/manual', authMiddleware, requireRoles(['ADMIN', 'VOLUNTEER']), async (req, res) => {
    try {
        const { sessionId, userId } = req.body;

        if (!sessionId || !userId) {
            return res.status(400).json({ error: 'Session and user are required' });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session.status !== 'ACTIVE') {
            return res.status(400).json({ error: 'Session must be ACTIVE' });
        }

        const existingAttendance = await Attendance.findOne({ userId, sessionId });
        if (existingAttendance) {
            return res.status(400).json({ error: 'Already marked present' });
        }

        const attendance = await Attendance.create({
            userId,
            sessionId,
            method: 'MANUAL',
            markedBy: req.user.id
        });

        return res.json({ message: 'Marked present', attendance });
    } catch (error) {
        console.error('Manual attendance error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/report/overall', authMiddleware, requireRoles(['ADMIN', 'VOLUNTEER']), async (req, res) => {
    try {
        const totalSessions = await Session.countDocuments();

        // Get all member user IDs
        const memberDocs = await User.find(
            { role: 'MEMBER' },
            { _id: 1 }
        );
        const memberIdList = memberDocs.map(m => m._id);
        const totalMembers = memberIdList.length;

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get distinct member userIds who have attendance TODAY (no duplicates)
        const presentUserIds = await Attendance.distinct('userId', {
            userId: { $in: memberIdList },
            markedAt: { $gte: today, $lt: tomorrow }
        });
        const presentToday = presentUserIds.length;

        // Calculate absent count
        const absentToday = totalMembers - presentToday;

        // Calculate attendance percentage
        const attendancePercent = totalMembers === 0
            ? '0.0'
            : ((presentToday / totalMembers) * 100).toFixed(1);

        // Get QR and manual counts
        const qrCount = await Attendance.countDocuments({ method: 'QR' });
        const manualCount = await Attendance.countDocuments({ method: 'MANUAL' });

        return res.json({
            totalSessions,
            totalMembers,
            presentToday,
            absentToday,
            attendancePercent,
            qrCount,
            manualCount
        });
    } catch (error) {
        console.error('Overall report error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/report/session/:sessionId', authMiddleware, requireRoles(['ADMIN', 'VOLUNTEER']), async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await Session.findById(sessionId).select('title date venue type status');
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const totalMembers = await User.countDocuments({ role: 'MEMBER' });
        const presentCount = await Attendance.countDocuments({ sessionId });
        const qrCount = await Attendance.countDocuments({ sessionId, method: 'QR' });
        const manualCount = await Attendance.countDocuments({ sessionId, method: 'MANUAL' });

        const absentCount = Math.max(totalMembers - presentCount, 0);
        const attendancePercent = totalMembers
            ? Math.round((presentCount / totalMembers) * 1000) / 10
            : 0;

        const attendance = await Attendance.find({ sessionId })
            .populate('userId', 'name email')
            .sort({ markedAt: -1 });

        const responseAttendance = attendance.map(record => ({
            name: record.userId?.name || 'Unknown',
            email: record.userId?.email || '',
            method: record.method,
            markedAt: record.markedAt
        }));

        return res.json({
            session,
            totalMembers,
            presentCount,
            absentCount,
            attendancePercent,
            qrCount,
            manualCount,
            attendance: responseAttendance
        });
    } catch (error) {
        console.error('Session report error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/members/:sessionId', authMiddleware, requireRoles(['ADMIN', 'VOLUNTEER']), async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await Session.findById(sessionId).select('_id');
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const members = await User.find({ role: { $in: ['MEMBER', 'VOLUNTEER'] } })
            .select('name email role')
            .sort({ name: 1 });

        const attendance = await Attendance.find({ sessionId })
            .select('userId')
            .lean();

        const attendanceMap = new Map(
            attendance.map(record => [record.userId.toString(), record._id.toString()])
        );

        const responseMembers = members.map(member => {
            const attendanceId = attendanceMap.get(member._id.toString()) || null;
            return {
                _id: member._id,
                name: member.name,
                email: member.email,
                role: member.role,
                isPresent: Boolean(attendanceId),
                attendanceId
            };
        });

        return res.json({ members: responseMembers });
    } catch (error) {
        console.error('Get members error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:attendanceId', authMiddleware, requireRoles(['ADMIN']), async (req, res) => {
    try {
        const { attendanceId } = req.params;

        const attendance = await Attendance.findById(attendanceId);
        if (!attendance) {
            return res.status(404).json({ error: 'Attendance not found' });
        }

        const elapsedMs = Date.now() - new Date(attendance.markedAt).getTime();
        if (elapsedMs > 10 * 60 * 1000) {
            return res.status(400).json({ error: 'Cannot undo after 10 minutes' });
        }

        await attendance.deleteOne();

        return res.json({ message: 'Attendance unmarked' });
    } catch (error) {
        console.error('Undo attendance error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/session/:sessionId', authMiddleware, requireRoles(['ADMIN', 'VOLUNTEER']), async (req, res) => {
    try {
        const { sessionId } = req.params;

        const attendance = await Attendance.find({ sessionId })
            .populate('userId', 'name email role')
            .populate('markedBy', 'name')
            .sort({ markedAt: -1 });

        const responseAttendance = attendance.map(record => ({
            _id: record._id,
            userId: record.userId?._id,
            name: record.userId?.name,
            email: record.userId?.email,
            role: record.userId?.role,
            method: record.method,
            markedAt: record.markedAt,
            markedByName: record.markedBy?.name || null
        }));

        return res.json({ count: responseAttendance.length, attendance: responseAttendance });
    } catch (error) {
        console.error('Get attendance error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Member endpoints
router.get('/member/my-stats', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const attended = await Attendance.countDocuments({ userId });
        const totalSessions = await Session.countDocuments();

        const percentage = totalSessions
            ? Math.round((attended / totalSessions) * 1000) / 10
            : 0;

        // compute streak: consecutive past sessions (most recent first) attended by the user
        const sessions = await Session.find().sort({ date: -1 }).lean();
        const attendedRecords = await Attendance.find({ userId }).populate('sessionId', 'title date venue type').lean();
        const attendedSet = new Set(attendedRecords.map(a => a.sessionId._id.toString()));

        let streak = 0;
        const now = Date.now();
        for (const session of sessions) {
            if (new Date(session.date).getTime() > now) continue;
            if (attendedSet.has(session._id.toString())) {
                streak += 1;
            } else {
                break;
            }
        }

        const sessionsAttended = attendedRecords.map(record => ({
            sessionId: record.sessionId,
            method: record.method,
            markedAt: record.markedAt
        }));

        return res.json({ attended, totalSessions, percentage, streak, sessionsAttended });
    } catch (error) {
        console.error('Member stats error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/member/my-attendance', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const attendance = await Attendance.find({ userId })
            .populate('sessionId', 'title date venue type')
            .sort({ markedAt: -1 });

        const response = attendance.map(record => ({
            _id: record._id,
            sessionId: record.sessionId?._id,
            title: record.sessionId?.title || 'Unknown',
            date: record.sessionId?.date || null,
            venue: record.sessionId?.venue || '',
            type: record.sessionId?.type || 'GENERAL',
            method: record.method,
            markedAt: record.markedAt
        }));

        return res.json({ attendance: response, count: response.length });
    } catch (error) {
        console.error('Member attendance error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
