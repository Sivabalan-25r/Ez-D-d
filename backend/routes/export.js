const express = require('express');
const router = express.Router();
const JSZip = require('jszip');
const { generateHTML } = require('../services/generator');

// POST /export
router.post('/', async (req, res) => {
    try {
        const { canvasData, projectName } = req.body;
        if (!canvasData) return res.status(400).json({ error: "Missing canvas data" });

        const zip = new JSZip();
        const html = generateHTML(canvasData);
        
        // Bundle into ZIP
        zip.file("index.html", html);
        zip.file("project.json", JSON.stringify(canvasData, null, 2));
        
        const content = await zip.generateAsync({ type: "nodebuffer" });
        const name = projectName ? projectName.replace(/\s+/g, '_') : 'project';
        
        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${name}_export.zip"`,
            'Content-Length': content.length
        });
        
        res.send(content);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
