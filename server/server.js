const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
const PORT = 5000;

// PASTE YOUR NEW GROQ KEY HERE
const groq = new Groq({
  apiKey: 'process.env.GROQ_API_KEY'
});

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ai-study-assistant')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB Error:', err));

app.get('/', (req, res) => {
  res.send('Backend Running on Groq ✅');
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: message }],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.log('Groq Error:', error);
    res.json({ reply: 'Error: ' + error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));