const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Create new project
router.post('/', async (req, res) => {
    try {
        const { userId, projectName, canvasData } = req.body;
        const project = new Project({ userId, projectName, canvasData });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get user projects
router.get('/:userId', async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update project
router.put('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete project
router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
