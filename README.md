# ShortList - AI Resume Screening Tool

JobTalk is an intelligent resume screening application that uses **Groq AI** (Llama 3) to analyze resumes against job descriptions. It features a minimal, "vibey" light-themed UI with interactive 3D elements and a powerful RAG (Retrieval-Augmented Generation) backend for chatting with candidate profiles.

![ShortList](<img width="1919" height="912" alt="Screenshot 2026-09-04 151713" src="https://github.com/user-attachments/assets/f6007c3e-decb-416d-9cbf-82c6cf8fa4fc" />
)

## Features

- **📄 Resume Analysis**: Upload a PDF resume and get an instant match score, strengths, and gaps analysis.
- **💬 AI Chat**: Chat with the candidate's profile using a RAG-powered assistant.
- **🧠 Local Embeddings**: Uses `@xenova/transformers` for free, private, local embedding generation.
- **⚡ Groq Powered**: Blazing fast inference using `llama-3.3-70b-versatile` for analysis and `llama-3.1-8b-instant` for chat summarization.
- **🎨 Modern UI**: Minimal light theme, clean typography, and interactive 3D background using Three.js.

## Quick Start

### Prerequisites
- Node.js (v18+)
- A [Groq API Key](https://console.groq.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd JobTalk
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    cp .env.example .env
    # Edit .env and add your GROQ_API_KEY
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Open Application**
    Visit `http://localhost:5173` in your browser.

## Project Structure

```
ShortList/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Upload, Dashboard, Chat, 3D Background)
│   │   ├── App.tsx         # Main Application Component
│   │   ├── index.css       # Global Styles & Tailwind Directives
│   │   └── main.tsx        # Entry Point
│   ├── tailwind.config.js  # Tailwind Configuration (Light Theme)
│   └── vite.config.ts      # Vite Configuration
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Request Handlers (Resume Upload, Chat)
│   │   ├── services/       # Business Logic
│   │   │   ├── llm.ts      # Groq API Integration (Llama 3)
│   │   │   └── rag.ts      # Local RAG Service (Embeddings & Vector Store)
│   │   ├── routes/         # API Routes
│   │   └── app.ts          # Express App Setup
│   ├── .env                # Environment Variables (Groq API Key)
│   └── package.json        # Backend Dependencies
│
└── sample_data/            # Test Files (Resume & Job Description)
```

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, React Three Fiber.
- **Backend**: Node.js, Express, TypeScript, Multer.
- **AI/ML**: Groq SDK (Llama 3), Transformers.js (Embeddings), PDF-Parse.

## License

MIT
