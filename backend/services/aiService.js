const fetch = require('node-fetch');
require('dotenv').config();

// ── AI Provider Wrapper with Timeout Control ───────────────────
async function fetchWithTimeout(url, options, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// ── Primary: Gemini 2.0 Flash ──────────────────────────────────
async function generateWithGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  console.log('[AI_ENGINE] Summoning Gemini 2.0 Flash...');
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
    })
  });
  if (!response.ok) {
    const error = await response.json();
    throw { status: response.status, error };
  }
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// ── Secondary: Groq (Mixtral) Fallback ─────────────────────────
async function generateWithGroq(prompt) {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  console.log('[AI_ENGINE] Summoning Groq (Mixtral) Fallback...');
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: 'You are a technical UI generator. Output ONLY clean HTML with Tailwind CSS. No explanations.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2048,
      temperature: 0.6,
    })
  }, 8000); // 8s for speed fallback
  if (!response.ok) {
    const error = await response.json();
    throw { status: response.status, error };
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

function cleanHTML(html) {
  return html.replace(/```html/g, "").replace(/```/g, "").trim();
}

async function generateComponent(config) {
  const { type, theme = 'dark', userPrompt = "" } = config;
  const start = Date.now();
  const systemPrompt = `Archetype: ${type}\nTheme: ${theme}\nRequest: ${userPrompt}\nRules: Valid Tailwind HTML ONLY. Wrap in <section>. No MKDN.`;

  try {
    const result = await generateWithGemini(systemPrompt);
    console.log(`[AI_ENGINE] Gemini Success (${Date.now() - start}ms) ✅`);
    return { html: cleanHTML(result), source: 'gemini' };
  } catch (err) {
    console.warn(`[AI_ENGINE] Gemini Failed/Timed Out. Status: ${err.status || 'TIMEOUT'}. Re-routing...`);
    try {
      const groqStart = Date.now();
      const result = await generateWithGroq(systemPrompt);
      console.log(`[AI_ENGINE] Groq Fallback Success (${Date.now() - groqStart}ms) 🛡️`);
      return { html: cleanHTML(result), source: 'groq' };
    } catch (groqErr) {
      console.error('[AI_ENGINE] CRITICAL: Both AI Providers Offline.');
      throw new Error('AI Overload - Our oracles are currently at capacity.');
    }
  }
}

async function refineComponent(html, instruction) {
  const start = Date.now();
  const refinePrompt = `
  Existing Code:
  ${html}
  
  Instructions for Evolution:
  ${instruction}
  
  Strict Rules:
  - Preserve all functional parts (HREF, IDs, Images)
  - Output ONLY the updated raw HTML
  - No markdown, no explanations
  - Keep Tailwind CSS context.
  `;

  try {
    const result = await generateWithGemini(refinePrompt);
    console.log(`[AI_REFINE] Gemini Success (${Date.now() - start}ms) ✅`);
    return { html: cleanHTML(result), source: 'gemini' };
  } catch (err) {
    console.warn(`[AI_REFINE] Gemini Fallback to Groq...`);
    const result = await generateWithGroq(refinePrompt);
    return { html: cleanHTML(result), source: 'groq' };
  }
}

module.exports = { generateComponent, refineComponent };
