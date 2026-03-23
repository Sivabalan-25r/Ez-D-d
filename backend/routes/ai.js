const express = require('express');
const router = express.Router();
const { generateComponent } = require('../services/aiService');

router.post('/generate-component', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const result = await generateComponent(prompt);
        res.json({ success: true, html: result.html, source: result.source });

    } catch (err) {
        console.error('AI generation error:', err);
        res.status(500).json({ error: err.message || 'Generation failed' });
    }
});

module.exports = router;
