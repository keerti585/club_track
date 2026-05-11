const express = require('express');
const Assignment = require('../models/Assignment.model');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

const requireRoles = roles => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
};

router.post('/create', authMiddleware, requireRoles(['ADMIN']), async (req, res) => {
    try {
        const { sessionId, title, description, dueDate } = req.body;

        if (!sessionId || !title) {
            return res.status(400).json({ error: 'sessionId and title are required' });
        }

        const assignment = await Assignment.create({
            sessionId,
            title,
            description: description || '',
            dueDate,
            createdBy: req.user.id
        });

        return res.status(201).json({ message: 'Assignment created', assignment });
    } catch (error) {
        console.error('Create assignment error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/session/:sessionId', authMiddleware, async (req, res) => {
    try {
        const { sessionId } = req.params;

        const assignments = await Assignment.find({ sessionId })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        return res.json({ assignments, count: assignments.length });
    } catch (error) {
        console.error('Get session assignments error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/all', authMiddleware, async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate('sessionId', 'title date venue type')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        return res.json({ assignments, count: assignments.length });
    } catch (error) {
        console.error('Get all assignments error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', authMiddleware, requireRoles(['ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;

        const assignment = await Assignment.findByIdAndDelete(id);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        return res.json({ message: 'Assignment deleted' });
    } catch (error) {
        console.error('Delete assignment error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
