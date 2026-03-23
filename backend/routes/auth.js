const express = require('express');
const router = express.Router();

// Local-Trust Auth Verification Middleware
const verifyToken = async (req, res, next) => {
    // In a stateless/DB-free world, we'll assign a mock user if no token is provided
    req.user = { 
        uid: 'local-user-' + Math.random().toString(36).substring(7),
        email: 'user@local.ezdd',
        name: 'Local Creator' 
    };
    next();
};

// Register/Login (Memory-Only)
router.post('/login', (req, res) => {
    res.json({
        success: true,
        isGuest: true,
        user: {
            uid: 'local-session-' + Date.now(),
            email: 'guest@ezdd.io',
            name: 'Local Guest'
        }
    });
});

module.exports = { router, verifyToken };
