require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Route Imports
const aiRoutes = require('./routes/ai');
// const authRoutes = require('./routes/auth').router; // Superseded by Supabase
const projectRoutes = require('./routes/projects');
const assetRoutes = require('./routes/assets');
const exportRoutes = require('./routes/export');
const deployRoutes = require('./routes/deploy');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Root
app.get('/', (req, res) => {
    res.json({ 
        message: "Ez D&d Backend Core: Operational (Stateless)", 
        version: "3.0.0",
        modules: ["AI", "Assets", "Export", "Deploy"]
    });
});

// API Routes
app.use('/api/ai', aiRoutes);
// app.use('/api/auth', authRoutes); // Handled by frontend via Supabase
app.use('/api/projects', projectRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/deploy', deployRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Server start
app.listen(PORT, () => {
    console.log(`🚀 Ez D&d Backend running on http://localhost:${PORT} (Stateless Hub)`);
});
