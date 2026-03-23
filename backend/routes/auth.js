const express = require('express');
const router = express.Router();
const admin = require('../configs/firebase');

// Firebase Auth Verification Middleware
const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) return res.status(403).json({ error: "Unauthorized access" });
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid ID Token" });
    }
};

// Register/Login Check
router.post('/login', verifyToken, (req, res) => {
    // Firebase already handled the auth, this route is to record the user in our sync system
    res.json({
        success: true,
        user: {
            uid: req.user.uid,
            email: req.user.email,
            name: req.user.name || "User"
        }
    });
});

module.exports = { router, verifyToken };
