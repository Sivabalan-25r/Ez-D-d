require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Root
app.get('/', (req, res) => {
    res.json({ message: "Ez D&d Backend Core: Operational", v: "1.0.0" });
});

// Routes
app.use('/api/ai', aiRoutes);

// Server start
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
