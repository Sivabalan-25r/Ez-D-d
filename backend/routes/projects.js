const express = require('express');
const router = express.Router();

// Memory-Only Store (Stateless fallback)
let projectsMock = [];

// Create new project
router.post('/', (req, res) => {
    try {
        const { userId, projectName, canvasData } = req.body;
        const newProject = {
            _id: 'proj-' + Date.now(),
            userId,
            projectName,
            canvasData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        projectsMock.push(newProject);
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get user projects
router.get('/:userId', (req, res) => {
    res.json(projectsMock.filter(p => p.userId === req.params.userId));
});

// Update project
router.put('/:id', (req, res) => {
    try {
        const idx = projectsMock.findIndex(p => p._id === req.params.id);
        if (idx !== -1) {
            projectsMock[idx] = { ...projectsMock[idx], ...req.body, updatedAt: new Date() };
            return res.json(projectsMock[idx]);
        }
        res.status(404).json({ error: 'Project not found' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete project
router.delete('/:id', (req, res) => {
    projectsMock = projectsMock.filter(p => p._id !== req.params.id);
    res.json({ message: "Project deleted from memory" });
});

module.exports = router;
