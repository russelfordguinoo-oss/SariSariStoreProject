const express = require('express');
const { verifyToken } = require('../auth/auth.middleware');

const router = express.Router();
const SYSTEM_INSTRUCTIONS = `You are the friendly assistant for a Philippine sari-sari store management app. Help store owners use the Dashboard, Products, Inventory, Sales/POS, Transactions, Reports, and Settings pages. Be concise, practical, and clear. You do not have access to live store records, so never invent sales totals, stock amounts, product names, or account details. Explain how to find information in the app instead. Do not provide financial, legal, or medical advice.`;

function extractText(response) {
  if (response.output_text) return response.output_text;
  return response.output
    ?.flatMap((item) => item.content || [])
    .filter((content) => content.type === 'output_text')
    .map((content) => content.text)
    .join('') || 'I could not generate a response. Please try again.';
}

router.post('/chat', verifyToken, async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
  if (!message || message.length > 1500) return res.status(400).json({ message: 'Please enter a message up to 1,500 characters.' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ message: 'The AI assistant is not configured yet. Add OPENAI_API_KEY to the backend environment.' });
  try {
    const input = [
      ...history.filter((item) => ['user', 'assistant'].includes(item.role) && typeof item.content === 'string').map((item) => ({ role: item.role, content: item.content.slice(0, 1500) })),
      { role: 'user', content: message },
    ];
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-5.6-terra', instructions: SYSTEM_INSTRUCTIONS, input, text: { verbosity: 'low' } }),
    });
    const data = await response.json();
    if (!response.ok) { console.error('OpenAI assistant error:', data.error?.message); return res.status(502).json({ message: 'The AI assistant is temporarily unavailable. Please try again shortly.' }); }
    res.json({ reply: extractText(data) });
  } catch (error) {
    console.error('Assistant request failed:', error.message);
    res.status(502).json({ message: 'The AI assistant is temporarily unavailable. Please try again shortly.' });
  }
});

module.exports = router;
