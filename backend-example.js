/**
 * Example Express + Groq Backend for FinSync AI
 * 
 * This is a reference implementation showing how to connect the frontend
 * to the Groq API. You can use this as-is or adapt it to your needs.
 * 
 * Setup:
 * 1. Create a new directory for your backend (e.g., 'backend/')
 * 2. npm init -y
 * 3. npm install express groq-sdk cors dotenv
 * 4. Create a .env file with: GROQ_API_KEY=your_api_key_here
 * 5. Run: node server.js
 */

import express from 'express';
import Groq from 'groq-sdk';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// System prompt for FinSync AI
const SYSTEM_PROMPT = `You are FinSync AI, an intelligent multi-agent loan assistant for an NBFC (Non-Banking Financial Company).

Your capabilities:
- Sales Agent: Understand customer needs, explain loan products, check basic eligibility
- Verification Agent: Verify customer documents and information
- Underwriting Agent: Assess creditworthiness, calculate loan terms
- Sanction Agent: Generate sanction letters and final approval documents

You should:
- Be professional yet friendly
- Ask clarifying questions when needed
- Explain the loan process clearly
- Provide realistic loan scenarios (this is a demo)
- Mention which "agent" is handling each part of the conversation

Remember: This is a demonstration system using mock data.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    // Add system prompt if not present
    const messagesWithSystem = messages[0]?.role === 'system' 
      ? messages 
      : [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: messagesWithSystem,
      model: 'llama-3.1-70b-versatile', // or 'mixtral-8x7b-32768'
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const reply = completion.choices[0]?.message?.content || 'No response generated';

    // Simple agent detection based on response content
    // You can make this more sophisticated with fine-tuned models
    let agent = 'master';
    const lowerReply = reply.toLowerCase();
    
    if (lowerReply.includes('eligibility') || lowerReply.includes('qualify')) {
      agent = 'sales';
    } else if (lowerReply.includes('verify') || lowerReply.includes('document')) {
      agent = 'verification';
    } else if (lowerReply.includes('credit') || lowerReply.includes('underwrit')) {
      agent = 'underwriting';
    } else if (lowerReply.includes('sanction') || lowerReply.includes('approval')) {
      agent = 'sanction';
    }

    res.json({
      reply,
      agent,
    });

  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FinSync AI backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 FinSync AI Backend running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
});
