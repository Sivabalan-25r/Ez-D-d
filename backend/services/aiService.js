const fetch = require('node-fetch');
require('dotenv').config();

// ── Primary: Gemini 2.5 Flash-Lite ─────────────────────────────
async function generateWithGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, error };
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// ── Fallback: Groq (Llama 3) ─────────────────────────────────
async function generateWithGroq(prompt) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You are a frontend code generator. Output ONLY raw HTML+CSS+JS. No markdown. No explanation. No code fences.'
                },
                { role: 'user', content: prompt }
            ],
            max_tokens: 2048,
            temperature: 0.7,
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// ── Main function with automatic fallback ───────────────────
async function generateComponent(userPrompt) {
    const systemPrompt = `
        You are an expert frontend developer.
        Generate a responsive HTML component based on the user's description.
        Rules:
        - Output ONLY the raw HTML block (no <html>, <head>, or <body> tags)
        - Use Tailwind CSS for styling where possible (assuming CDN is provided in parent)
        - Otherwise, include all CSS inside a <style> tag within the component
        - Use modern, clean design with subtle shadows and rounded corners
        - Make it mobile-responsive
        - Use the color scheme: teal (#0D9488) and blue (#2563EB) as accents
        - No JavaScript unless the user specifically asks for it
        
        User request: ${userPrompt}
    `;

    try {
        console.log('Trying Gemini API...');
        const result = await generateWithGemini(systemPrompt);
        console.log('Gemini succeeded ✅');
        return { html: result, source: 'gemini' };
    } catch (err) {
        if (err.status === 429 || err.status === 400) {
            console.log('Gemini provider issues. Switching to Groq...');
            try {
                const result = await generateWithGroq(systemPrompt);
                console.log('Groq succeeded ✅');
                return { html: result, source: 'groq' };
            } catch (groqErr) {
                throw new Error('Both AI providers failed. Try again in a moment.');
            }
        }
        throw err;
    }
}

module.exports = { generateWithGemini, generateWithGroq, generateComponent };
