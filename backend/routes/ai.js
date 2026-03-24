const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { generateComponent } = require('../services/aiService');

// 🛡️ Security: Rate limiting (per IP) to prevent AI over-summoning
const aiGeneratorLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    message: { error: "Our AI Oracle is resting. Try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false
});

router.post('/generate-component', aiGeneratorLimiter, async (req, res) => {
    try {
        const config = req.body;
        const promptToProcess = config.prompt || config.userPrompt;

        // 🛡️ Validation: Ensure the request is meaningful
        if (!promptToProcess || promptToProcess.trim().length < 10) {
            return res.status(400).json({ error: 'Be more descriptive! Prompt must be at least 10 characters.' });
        }

        const validTypes = ['hero', 'features', 'pricing', 'custom'];
        const selectedType = (config.type || 'custom').toLowerCase();

        if (!validTypes.includes(selectedType)) {
            return res.status(400).json({ error: 'Invalid Archetype requested.' });
        }

        const result = await generateComponent({
            type: selectedType,
            theme: config.theme || 'dark',
            cta: config.cta !== undefined ? config.cta : true,
            columns: config.columns || 1,
            userPrompt: promptToProcess
        });

        res.json({ success: true, html: result.html, source: result.source });

    } catch (err) {
        console.error('AI Route Error:', err);
        res.status(500).json({ error: err.message || 'The AI is currently shy. Try again later.' });
    }
});

router.post('/refine-component', aiGeneratorLimiter, async (req, res) => {
    try {
        const { existingHTML, instruction } = req.body;

        if (!existingHTML || !instruction || instruction.length < 5) {
            return res.status(400).json({ error: 'Instruction too short. Be specific (e.g. "make text blue").' });
        }

        const { refineComponent } = require('../services/aiService');
        const result = await refineComponent(existingHTML, instruction);

        res.json({ success: true, html: result.html, source: result.source });

    } catch (err) {
        console.error('AI Refinement Error:', err);
        res.status(500).json({ error: err.message || 'Refinement failed.' });
    }
});

router.post('/refine-text', aiGeneratorLimiter, async (req, res) => {
    try {
        const { text, instruction } = req.body;

        if (!text || !instruction) {
            return res.status(400).json({ error: 'Text and instruction required.' });
        }

        const { refineText } = require('../services/aiService');
        const result = await refineText(text, instruction);

        res.json({ success: true, text: result.text, source: result.source });

    } catch (err) {
        console.error('AI Text Refinement Error:', err);
        res.status(500).json({ error: 'Text refinement failed.' });
    }
});

router.post('/analyze-ux', aiGeneratorLimiter, async (req, res) => {
    try {
        const { html } = req.body;

        if (!html) {
            return res.status(400).json({ error: 'HTML component required for analysis.' });
        }

        const { analyzeUX } = require('../services/aiService');
        const result = await analyzeUX(html);

        res.json({ success: true, suggestions: result.text, source: result.source });

    } catch (err) {
        console.error('AI UX Analysis Error:', err);
        res.status(500).json({ error: 'UX Analysis failed.' });
    }
});

module.exports = router;
