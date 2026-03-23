const express = require('express');
const router = express.Router();
const axios = require('axios');
const JSZip = require('jszip');
const Project = require('../models/Project');
const { generateHTML } = require('../services/generator');

// POST /deploy/:projectId
router.post('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ error: "Project not found" });

        const zip = new JSZip();
        zip.file("index.html", generateHTML(project.canvasData));
        const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

        // Netlify Deployment
        if (!process.env.NETLIFY_TOKEN) {
            return res.status(501).json({ 
                error: "Deployment token not configured",
                suggestedUrl: "https://ezdd-preview.netlify.app" 
            });
        }

        const netlifyResponse = await axios.post(
            `https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}/deploys`,
            zipBuffer,
            {
                headers: {
                    'Content-Type': 'application/zip',
                    'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}`
                }
            }
        );

        const deployUrl = netlifyResponse.data.ssl_url || netlifyResponse.data.url;
        
        // Update Project record
        project.published = true;
        project.publishUrl = deployUrl;
        await project.save();

        res.json({
            success: true,
            url: deployUrl,
            message: "Project deployed to Netlify"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
