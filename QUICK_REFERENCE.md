# 🚀 Quick Reference - FinSync AI

## Essential Commands

```bash
# Install dependencies
npm install

# Start development server (frontend only)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## File Locations

### 📝 Key Files to Edit

- **`src/App.tsx`** - Main app logic, state management
- **`src/components/ChatWindow.tsx`** - Chat display, quick actions
- **`src/components/MessageBubble.tsx`** - Message styling, agent tags
- **`src/components/ChatInput.tsx`** - Input behavior
- **`src/components/Sidebar.tsx`** - Branding, features list
- **`src/api/chat.ts`** - Backend API calls
- **`src/types/index.ts`** - TypeScript types

### 🎨 Styling

- **`tailwind.config.js`** - Colors, theme customization
- **`src/index.css`** - Global styles

### ⚙️ Configuration

- **`vite.config.ts`** - Dev server, proxy settings
- **`package.json`** - Dependencies, scripts

## Common Customizations

### Change Color Scheme

Edit `tailwind.config.js`:
```javascript
primary: {
  500: '#YOUR_COLOR',
  600: '#DARKER_SHADE',
}
```

### Add New Agent Type

1. Update `src/types/index.ts`:
   ```typescript
   export type AgentType = 'master' | 'sales' | 'verification' | 'underwriting' | 'sanction' | 'new-agent';
   ```

2. Add colors in `src/components/MessageBubble.tsx`:
   ```typescript
   const agentColors: Record<string, string> = {
     'new-agent': 'bg-purple-100 text-purple-700',
     // ...
   };
   ```

### Modify Quick Actions

Edit `src/components/ChatWindow.tsx`, find the `QuickActionButton` components and modify/add new ones.

### Change API Endpoint

Edit `src/api/chat.ts` to change the `/api/chat` endpoint URL.

## TypeScript Types

```typescript
// Message structure
interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  meta?: {
    agent?: AgentType;
  };
}

// API request
interface ChatRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

// API response
interface ChatResponse {
  reply: string;
  agent?: AgentType;
}
```

## Component Props

### ChatWindow
- `messages: Message[]` - Array of chat messages
- `isLoading: boolean` - Show typing indicator
- `onQuickAction: (action: string) => void` - Handle quick action clicks

### ChatInput
- `onSend: (message: string) => void` - Handle send message
- `disabled?: boolean` - Disable input
- `error?: string | null` - Show error message

### MessageBubble
- `message: Message` - Single message to display

## State Management

All state is in `src/App.tsx`:
- `messages` - Chat history
- `isLoading` - Loading state
- `error` - Error messages

No Redux needed - using React hooks only.

## Responsive Breakpoints

- `lg:` - 1024px+ (desktop with sidebar)
- `md:` - 768px+ (tablet)
- Default - Mobile

## Tips & Tricks

### Debug Mode
Add to `App.tsx`:
```typescript
console.log('Messages:', messages);
console.log('Loading:', isLoading);
```

### Test Without Backend
See `BACKEND_SETUP.md` for mock server setup

### Hot Reload
Vite automatically hot-reloads on file changes

### Deployment
Build with `npm run build`, deploy `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static host

## Groq Models

Available models:
- `llama-3.1-70b-versatile` - Best for general chat
- `llama-3.1-8b-instant` - Faster, lower cost
- `mixtral-8x7b-32768` - Large context window

Change in `backend-example.js`.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance Tips

- Messages are automatically scrolled
- Textarea auto-expands (max 3 lines)
- Images/icons are minimal for fast loading
- Tailwind purges unused CSS in production

---

**Need Help?** Check `README.md` and `BACKEND_SETUP.md`

**Issues?** Common problems:
1. Port 5000 in use? Change in `vite.config.ts` and backend
2. CORS errors? Enable CORS in backend
3. API not responding? Check backend is running on port 5000
