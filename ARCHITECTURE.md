# System Architecture

JobTalk follows a modern client-server architecture designed for speed, privacy, and user experience.

## High-Level Overview

```mermaid
graph TD
    User[User] -->|Uploads PDF & JD| Client[React Frontend]
    Client -->|POST /analyze| Server[Express Backend]
    
    subgraph Backend
        Server -->|Parse PDF| PDFParser[pdf-parse]
        Server -->|Generate Embeddings| Embedder[Transformers.js (Local)]
        Embedder -->|Store Vectors| VectorStore[In-Memory RAG]
        
        Server -->|Analyze Match| GroqLLM[Groq API (Llama 3.3 70B)]
        GroqLLM -->|JSON Result| Server
    end
    
    subgraph Chat Flow
        User -->|Ask Question| Client
        Client -->|POST /chat| Server
        Server -->|Retrieve Context| VectorStore
        VectorStore -->|Relevant Chunks| Server
        Server -->|Generate Answer| GroqLLM
        GroqLLM -->|Summarize| GroqLLM_Small[Groq API (Llama 3.1 8B)]
        GroqLLM_Small -->|Final Response| Client
    end
```

## Components

### 1. Frontend (`/client`)
- **Framework**: React + Vite
- **Styling**: Tailwind CSS with a custom "Minimal Light" theme.
- **3D Graphics**: `@react-three/fiber` renders the interactive background sphere.
- **State Management**: Local React state (sufficient for this scope).

### 2. Backend (`/server`)
- **Runtime**: Node.js with TypeScript.
- **API**: Express.js REST API.
- **File Handling**: `multer` processes PDF uploads in memory.

### 3. AI Services (`/server/src/services`)
- **LLM Service (`llm.ts`)**:
    - **Analysis**: Uses `llama-3.3-70b-versatile` for deep analysis and JSON output.
    - **Chat**: Uses a two-step process:
        1.  Generate detailed answer with `llama-3.3-70b-versatile`.
        2.  Refine/Summarize with `llama-3.1-8b-instant` for conciseness.
    - **Embeddings**: Uses `Xenova/all-MiniLM-L6-v2` locally via `@xenova/transformers`. This ensures embeddings are free and fast, running on the CPU.

- **RAG Service (`rag.ts`)**:
    - Implements a simple in-memory vector store.
    - Chunks text by paragraphs.
    - Uses cosine similarity for retrieval.

## Data Flow

1.  **Upload Phase**:
    - User uploads PDF.
    - Server parses text.
    - Text is chunked and embedded (locally).
    - Embeddings are stored in memory.
    - Full text is sent to Groq for "Match Analysis" vs the Job Description.

2.  **Chat Phase**:
    - User asks a question.
    - Question is embedded.
    - Top 3 relevant chunks are retrieved from memory.
    - Context + Question sent to Groq for answer generation.
