const express = require('express');
const router = express.Router();
const JSZip = require('jszip');
const Project = require('../models/Project');
const { generateHTML } = require('../services/generator');

// POST /export/:projectId
router.post('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ error: "Project not found" });

        const zip = new JSZip();
        const html = generateHTML(project.canvasData);
        
        // Bundle into ZIP
        zip.file("index.html", html);
        zip.file("project.json", JSON.stringify(project.canvasData, null, 2));
        
        const content = await zip.generateAsync({ type: "nodebuffer" });
        
        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${project.projectName.replace(/\s+/g, '_')}_export.zip"`,
            'Content-Length': content.length
        });
        
        res.send(content);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
