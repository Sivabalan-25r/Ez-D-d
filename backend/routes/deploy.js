const express = require('express');
const router = express.Router();
const axios = require('axios');
const JSZip = require('jszip');
const { generateHTML } = require('../services/generator');

// POST /deploy
router.post('/', async (req, res) => {
    try {
        const { canvasData } = req.body;
        if (!canvasData) return res.status(400).json({ error: "Missing canvas data" });

        const zip = new JSZip();
        zip.file("index.html", generateHTML(canvasData));
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
