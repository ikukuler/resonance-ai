# Resonance AI - Music Discovery

AI-powered music recommendation system that understands context, moods, and abstract concepts.

## Features

- 🎵 Context-aware music recommendations
- 🌍 Multi-language support (English, Russian, Romanian)
- 🔒 Secure API key handling (backend proxy)
- 🎨 Modern, responsive UI

## Security

**Important:** API keys are stored securely on the backend server and never exposed to the client. The frontend communicates with a backend API that handles all Gemini API requests.

## Prerequisites

- Node.js (v20.19.0 or >=22.12.0 recommended)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

3. **Run the application:**

   **Option 1: Run both frontend and backend together:**
   ```bash
   npm run dev:all
   ```
   
   **Option 2: Run separately:**
   
   Terminal 1 (Backend):
   ```bash
   npm run dev:server
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

4. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend API server
- `npm run dev:all` - Start both frontend and backend concurrently
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm start` - Start backend server in production mode

## Project Structure

```
├── api/              # Vercel serverless functions (production)
│   └── recommendations.js  # API endpoint for Gemini requests
├── server/           # Backend Express server (local development)
│   └── index.js      # Local dev server
├── services/         # Frontend services
│   └── geminiService.ts  # Client API service
├── components/       # React components
├── contexts/         # React contexts (Language)
├── locales/          # Translation files
└── .env             # Environment variables (not in git)
```

## Environment Variables

- `GEMINI_API_KEY` - Your Gemini API key (required)
- `PORT` - Backend server port (default: 3001, only for local dev)
- `VITE_API_URL` - Backend API URL (optional, only for local dev)

## Deployment to Vercel

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import project to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Add Environment Variable:**
   - In Vercel project settings → Environment Variables
   - Add `GEMINI_API_KEY` with your actual API key
   - Make sure it's added for **Production**, **Preview**, and **Development**

4. **Deploy:**
   - Vercel will automatically detect Vite and deploy
   - The `api/` folder will be automatically converted to serverless functions
   - No additional configuration needed!

**Note:** 
- In production (Vercel), API calls go to `/api/recommendations` (serverless function)
- In local development, use `npm run dev:all` to run both frontend and Express server

## Security Notes

- Never commit `.env` file to version control
- API keys are only used on the backend server
- Frontend makes requests to backend API, not directly to Gemini
