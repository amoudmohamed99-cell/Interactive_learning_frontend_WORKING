# SpeakBetter - Student Frontend

The student-facing frontend for the **SpeakBetter** AI-powered interactive English learning platform. Built with **Vue.js 3** and **Vite**.

Students interact with **Ahmad**, an AI virtual tutor who helps them practice English conversation through 8 real-life scenarios.

---

## ✨ Features

- 🔐 **Student Login** — Login with unique student code
- 📚 **Scenario Selection** — Browse 8 conversational scenarios with Arabic/English titles
- 🔊 **System Check** — Test microphone & speaker before starting
- 🎭 **Animated Avatar (Ahmad)** — Real-time lip-synced avatar via Simli AI + WebRTC
- 🎤 **Voice Input** — Speech recognition using Web Speech API
- 🔊 **Voice Output** — Ahmad speaks with cloned voice via ElevenLabs TTS
- 🔄 **Corrective Feedback** — Real-time grammar correction (recast, clarification, model)
- 📊 **Session Results** — View accuracy, total turns, and session duration

---

## 🔄 User Flow

```
Login → Scenarios List → System Check → Session → Complete
  │          │                │             │          │
  │    Choose scenario   Test mic/speaker   │    View results
  │                                         │
  │              ┌──────────────────────────┐│
  │              │     SESSION PHASES        ││
  │              │                          ││
  │              │  1. Greeting  (أحمد يسلّم)││
  │              │  2. Vocabulary (مفردات)   ││
  │              │  3. Conversation (محادثة) ││
  │              │  4. Feedback   (تقييم)    ││
  │              │  5. Completed  (انتهاء)   ││
  │              └──────────────────────────┘│
```

### The Conversation Loop (Phase 3)
```
🎤 Student speaks English
      ↓
🗣️ Web Speech API → converts to text
      ↓
📤 POST /api/v1/conversation/speak → sends text to backend
      ↓
🤖 Backend → OpenAI GPT evaluates + responds as Ahmad
      ↓
🔊 Backend → ElevenLabs generates Ahmad's voice (MP3)
      ↓
📥 Frontend receives: { ahmad_response, audio, feedback }
      ↓
🎭 Audio sent to Simli → Ahmad's lips move in sync
      ↓
🔁 Repeat until conversation completes
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Vue.js** | 3.5 | UI Framework |
| **Vue Router** | 4.6 | Client-side routing with auth guards |
| **Vite** | 8.2 | Build tool & dev server |
| **Axios** | 1.20 | HTTP client for API calls |
| **Simli Client** | 3.0 | WebRTC avatar SDK |
| **Web Speech API** | Browser | Speech recognition (ASR) |

---

## 📁 Project Structure

```
student-frontend/
├── public/
│   └── backgrounds/           # Scene background images (sc01.jpg - sc08.jpg)
│
├── src/
│   ├── api/
│   │   └── index.js           # Axios instance + API helper functions
│   │
│   ├── assets/                # Static assets (images, icons)
│   │
│   ├── components/            # Reusable Vue components
│   │
│   ├── composables/           # Vue composables (shared logic)
│   │
│   ├── router/
│   │   └── index.js           # Routes + auth guard (token check)
│   │
│   ├── views/
│   │   ├── LoginView.vue      # Student login (enter code)
│   │   ├── ScenariosView.vue  # Scenario selection grid
│   │   ├── SystemCheckView.vue# Mic & speaker test before session
│   │   ├── SessionView.vue    # ⭐ Main session page (Ahmad + conversation)
│   │   └── CompleteView.vue   # Session results & stats
│   │
│   ├── App.vue                # Root component
│   ├── main.js                # Vue app entry point
│   └── style.css              # Global styles
│
├── vite.config.js             # Vite config + API proxy
├── package.json               # Dependencies
└── index.html                 # HTML entry point
```

---

## 🔑 Key Files Explained

### `SessionView.vue` — The Core (⭐ Most Important)
This is where the magic happens. ~35KB of code handling:
- **Simli WebRTC connection** — Connects to Simli, displays Ahmad's animated face
- **Phase management** — Tracks greeting → vocabulary → conversation → feedback → completed
- **Speech recognition** — Records student voice, converts to text
- **Audio playback** — Plays Ahmad's TTS responses
- **Conversation loop** — Sends student text to backend, receives Ahmad's reply
- **Vocabulary display** — Shows clickable vocab words with pronunciation
- **Background scenes** — Different background per scenario

### `api/index.js` — API Client
- Axios instance with base URL and auth token header
- Interceptors for automatic token injection
- Helper functions for all API endpoints

### `router/index.js` — Navigation Guards
- `meta: { auth: true }` — Redirects to login if no token
- `meta: { guest: true }` — Redirects to scenarios if already logged in
- Token stored in `localStorage`

---

## 📡 API Endpoints Used

| Endpoint | Used In | Purpose |
|----------|---------|---------|
| `POST /api/v1/auth/login` | LoginView | Student authentication |
| `GET /api/v1/scenarios` | ScenariosView | Fetch scenario list |
| `GET /api/v1/scenarios/:id` | SessionView | Get scenario details |
| `POST /api/v1/sessions/start` | SessionView | Start new session |
| `POST /api/v1/sessions/:id/advance-phase` | SessionView | Move to next phase |
| `POST /api/v1/conversation/speak` | SessionView | Send student speech |
| `POST /api/v1/tts` | SessionView | Text-to-Speech fallback |
| `POST /api/v1/simli/token` | SessionView | Get Simli session token |
| `GET /api/v1/simli/ice` | SessionView | Get WebRTC ICE servers |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Install

```bash
# 1. Clone
git clone <repo-url>
cd student-frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

The app runs on `http://localhost:3000`.

### API Proxy (Development)
In development, Vite proxies `/api` requests to the Laravel backend:

```js
// vite.config.js
proxy: {
  '/api': {
    target: 'https://interactive-learning.test',  // Laravel backend
    changeOrigin: true,
    secure: false
  }
}
```

### Build for Production
```bash
npm run build
```

Output goes to `dist/` folder. Deploy to **Vercel**, **Netlify**, or any static hosting.

---

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-railway-backend.up.railway.app`
5. Add `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🎭 Simli Avatar — How It Works

```
┌─────────────────────────────────────────────────────┐
│  1. Frontend gets Simli TOKEN from backend          │
│  2. Frontend gets ICE SERVERS from backend          │
│  3. Frontend opens WebRTC connection to Simli       │
│  4. Simli streams Ahmad's animated face (video)     │
│  5. When Ahmad speaks:                              │
│     - ElevenLabs generates audio (MP3)              │
│     - Frontend sends audio to Simli via WebRTC      │
│     - Simli analyzes audio → moves Ahmad's lips     │
│     - Real-time lip-synced video appears on screen  │
│  6. Student sees Ahmad talking naturally             │
└─────────────────────────────────────────────────────┘
```

The Face ID (`SIMLI_FACE_ID`) is a 3D model of Ahmad's face uploaded to Simli. It renders in real-time based on audio input.

---

## 📱 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | LoginView | Student enters code to login |
| `/scenarios` | ScenariosView | Grid of 8 scenarios to choose from |
| `/check/:id` | SystemCheckView | Test microphone & speakers |
| `/session/:id` | SessionView | Main session with Ahmad |
| `/complete/:id` | CompleteView | Session results & statistics |

---

## 👩‍💻 Team

- **Researcher**: Ahmad Al-Hayani — King Khalid University
- **Backend Developer**: Menna Mahmoud

## 📄 License

Academic research project — King Khalid University, Saudi Arabia.
