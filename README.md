# FinSync AI - Loan Assistant Chatbot

A modern, minimal single-page web application for a multi-agent loan chatbot powered by React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Clean UI/UX**: Modern design with light theme, subtle gradients, and card-style chat interface
- **Multi-Agent Architecture**: Visual indicators for different agents (Sales, Verification, Underwriting, Sanction)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Chat**: Smooth scrolling, typing indicators, and message timestamps
- **Quick Actions**: Pre-defined buttons for common queries
- **Easy Backend Integration**: Simple API stub ready for Groq API connection

## 📋 Prerequisites

- Node.js 16+ and npm

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## 🔌 Backend Integration

The app is configured to communicate with a backend API at `/api/chat`. Here's how to connect your Groq-powered backend:

### API Endpoint Structure

**Endpoint**: `POST /api/chat`

**Request Body**:
```json
{
  "messages": [
    { "role": "system", "content": "FinSync AI is a multi-agent NBFC loan assistant." },
    { "role": "user", "content": "Check my eligibility" }
  ]
}
```

**Expected Response**:
```json
{
  "reply": "I'd be happy to help you check your loan eligibility...",
  "agent": "sales"
}
```

### Setting Up Groq Backend (Example)

Create a simple Express server (`server.js`):

```javascript
import express from 'express';
import Groq from 'groq-sdk';

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    res.json({
      reply: completion.choices[0]?.message?.content || 'No response',
      agent: 'master', // You can implement logic to determine which agent responded
    });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.listen(5000, () => console.log('Backend running on port 5000'));
```

The Vite dev server is already configured to proxy `/api` requests to `http://localhost:5000`.

## 📁 Project Structure

```
EYTECHBanking/
├── src/
│   ├── api/
│   │   └── chat.ts          # API integration layer
│   ├── components/
│   │   ├── ChatInput.tsx    # Message input with auto-resize
│   │   ├── ChatWindow.tsx   # Chat history display
│   │   ├── MessageBubble.tsx # Individual message component
│   │   └── Sidebar.tsx      # Branding and features panel
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── App.tsx              # Main app container
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles + Tailwind
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` to change color schemes
- Edit component styles in individual `.tsx` files
- Global styles in `src/index.css`

### Message Types
Add new agent types in `src/types/index.ts`:
```typescript
export type AgentType = 'master' | 'sales' | 'verification' | 'underwriting' | 'sanction' | 'your-new-agent';
```

### Quick Actions
Edit quick action buttons in `src/components/ChatWindow.tsx`

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Demo Features

- System message explaining the multi-agent concept
- Welcome message with quick action buttons
- Simulated typing indicator
- Agent tags on assistant messages
- Timestamp formatting
- Error handling with user-friendly messages
- Auto-scroll to latest message
- Mobile-responsive layout

## 📄 License

This project is for demonstration purposes.

## 🤝 Contributing

This is a hackathon starter template. Feel free to modify and extend as needed!

---

**Built with** ⚡ Vite • ⚛️ React • 📘 TypeScript • 🎨 Tailwind CSS
