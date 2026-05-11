const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization ||
            req.headers.Authorization

        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' })
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Invalid token format' })
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ error: 'Token missing' })
        }

        const secret = process.env.JWT_SECRET || 'fallback_secret_key_123'
        const decoded = jwt.verify(token, secret)
        req.user = decoded
        next()

    } catch (err) {
        console.error('Auth middleware error:', err.message)
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}

module.exports = authMiddleware
