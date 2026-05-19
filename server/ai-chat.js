const express = require('express');
const Groq = require('groq-sdk');
const Chat = require('./Chat');
require('dotenv').config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/ask - Ask AI + Save to DB
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI Study Assistant. Explain concepts clearly for students. Use simple examples. Keep answers under 200 words.'
        },
        { role: 'user', content: question }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 500
    });

    const answer = completion.choices[0].message.content;

    const newChat = new Chat({ question, answer });
    await newChat.save();

    res.json({
      success: true,
      question,
      answer,
      id: newChat._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI failed to respond' });
  }
});

// GET /api/history - THIS IS THE ROUTE THAT'S MISSING
router.get('/history', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;