# FinSync AI Backend Setup Guide

## Quick Start

### Option 1: Using the Example Backend (Recommended for Hackathon)

1. **Create backend directory:**
   ```bash
   mkdir backend
   cd backend
   ```

2. **Initialize Node project:**
   ```bash
   npm init -y
   ```

3. **Install dependencies:**
   ```bash
   npm install express groq-sdk cors dotenv
   ```

4. **Copy the example server:**
   Copy `backend-example.js` from the root directory to `backend/server.js`

5. **Set up environment variables:**
   Create `backend/.env`:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   PORT=5000
   ```

6. **Get your Groq API key:**
   - Visit https://console.groq.com/
   - Sign up / Log in
   - Go to API Keys section
   - Create a new API key
   - Copy it to your .env file

7. **Run the backend:**
   ```bash
   node server.js
   ```

8. **Start the frontend** (in a new terminal, from project root):
   ```bash
   npm run dev
   ```

9. **Test it out:**
   Open http://localhost:3000 and start chatting!

---

## Option 2: Using a Different Backend Framework

### Python/Flask Example

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from groq import Groq

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    messages = data.get('messages', [])
    
    completion = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=messages,
        temperature=0.7,
        max_tokens=1024,
    )
    
    reply = completion.choices[0].message.content
    
    return jsonify({
        'reply': reply,
        'agent': 'master'
    })

if __name__ == '__main__':
    app.run(port=5000)
```

---

## Testing Without a Backend

If you want to test the frontend without setting up Groq:

1. **Create a mock server** (`backend/mock-server.js`):

```javascript
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', (req, res) => {
  const { messages } = req.body;
  const lastMessage = messages[messages.length - 1];
  
  // Simple mock responses
  const responses = {
    'eligibility': 'Based on your profile, you appear to be eligible for a personal loan up to ₹5,00,000. Would you like me to verify your documents?',
    'approval': 'Our multi-agent system works in stages: Sales → Verification → Underwriting → Sanction. Each agent specializes in one part of the process.',
    'sanction': 'I can generate a sample sanction letter for you. This will include loan amount, interest rate, tenure, and terms. Please note this is a demo document.',
    'default': 'I understand you want to know about ' + lastMessage.content + '. How can I help you with your loan application today?'
  };
  
  let reply = responses.default;
  const query = lastMessage.content.toLowerCase();
  
  if (query.includes('eligibility') || query.includes('qualify')) {
    reply = responses.eligibility;
  } else if (query.includes('approval') || query.includes('process')) {
    reply = responses.approval;
  } else if (query.includes('sanction') || query.includes('letter')) {
    reply = responses.sanction;
  }
  
  setTimeout(() => {
    res.json({ reply, agent: 'sales' });
  }, 1000); // Simulate network delay
});

app.listen(5000, () => console.log('Mock server running on port 5000'));
```

---

## Troubleshooting

### CORS Issues
If you see CORS errors:
- Make sure your backend has `cors` middleware enabled
- The Vite proxy in `vite.config.ts` should handle this automatically

### Port Already in Use
If port 5000 is taken:
- Change `PORT` in backend `.env`
- Update the proxy target in `vite.config.ts`

### API Key Not Working
- Verify your Groq API key is valid
- Check you have credits/quota remaining
- Ensure the key is in the `.env` file without quotes

---

## Advanced: Multi-Agent Orchestration

To implement true multi-agent behavior:

1. **Create separate prompts** for each agent
2. **Use function calling** to route to specific agents
3. **Implement agent handoff logic**
4. **Store conversation state** in a database

Example agent router:

```javascript
const agents = {
  sales: {
    prompt: "You are a sales agent. Focus on understanding needs and eligibility.",
    keywords: ['eligibility', 'qualify', 'loan type', 'interest rate']
  },
  verification: {
    prompt: "You are a verification agent. Focus on document verification.",
    keywords: ['document', 'verify', 'proof', 'upload']
  },
  // ... etc
};

function selectAgent(userMessage) {
  for (const [name, config] of Object.entries(agents)) {
    if (config.keywords.some(kw => userMessage.toLowerCase().includes(kw))) {
      return name;
    }
  }
  return 'master';
}
```

---

## Production Considerations

Before deploying:
- [ ] Add rate limiting
- [ ] Implement authentication
- [ ] Add logging and monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Use environment-specific configs
- [ ] Add input validation and sanitization
- [ ] Implement conversation persistence
- [ ] Add streaming responses for better UX

---

**Happy Hacking! 🚀**
