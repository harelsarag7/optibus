# Harel Sarag - Optibus RAG Demo

## 🎯 Overview

This project demonstrates an end-to-end RAG system that allows users to:

- View available domain documents (bus routes, driver shifts, scheduling policies)
- Query the document database semantically
- See retrieved passages and LLM-generated answers

### Backend (TypeScript + Express)

**Key Design Decisions:**

1. **Vector Store Abstraction**: The `IVectorStore` interface allows easy swapping between in-memory storage and production vector databases.

2. **Embedding Caching**: Embeddings are cached to `data/embeddings.json` to avoid redundant API calls on startup

3. **Modular RAG Pipeline**: Clear separation between retrieval (`Retriever`) and generation (`RAGService`)

### Frontend (React + TypeScript + Vite)

**Features:**

- Material-UI for modern, responsive design
- Real-time query processing with loading states
- Display of both retrieved documents and LLM answers
- Error handling and user feedback

## 🚀 Quick Start - To Optibus teammates - please use option 2.

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- OpenAI API key

### Option 1: Local Development

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo "OPENAI_API_KEY=your_key_here" > .env

# Run in development mode
npm run dev
```

The backend will start on `http://localhost:8000`

#### Frontend (Development Mode with Watch)

You can run the frontend in development mode with hot-reload, separately from the backend:

```bash
cd frontend

# Install dependencies
npm install

# Run development server with watch mode
npm run dev
```

The frontend will start on `http://localhost:3000` with hot-reload enabled.

**Note:** When running frontend in dev mode locally, it will connect to the backend at `http://localhost:8000` (or whatever you set in `VITE_API_BASE_URL`). Make sure the backend is running separately.

### Option 2: Docker Compose (Production Build)

Run both services in Docker with production builds:

```bash
# Create .env file in ROOT directory (not in backend/)
# Docker Compose reads .env from the root directory
echo "OPENAI_API_KEY=your_key_here" > .env

# Build and start services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

**Important:** The `.env` file must be in the root directory (`/optibus/.env`), not in `backend/.env`. Docker Compose reads environment variables from the root `.env` file.

- Frontend: `http://localhost:3000` (nginx production build)
- Backend: `http://localhost:8000`

### Option 3: Mixed Mode (Backend in Docker, Frontend in Dev Mode)

Run backend in Docker and frontend locally in dev mode with watch/hot-reload:

```bash
# Terminal 1: Start ONLY backend in Docker
docker-compose up backend

# Terminal 2: Start frontend in dev mode (with watch/hot-reload)
cd frontend
npm install
npm run dev
```

This gives you:

- Backend running in Docker: `http://localhost:8000`
- Frontend with hot-reload and watch mode: `http://localhost:3000`
- Any changes to `frontend/src/` will automatically reload in the browser

**Note:** The frontend in dev mode automatically connects to `http://localhost:8000` for the backend API.

## 📡 API Endpoints

### `GET /documents`

Returns the list of available documents.

**Response:**

```json
{
  "documents": [
    {
      "id": "planning_1",
      "module": "Planning",
      "text": "Route 1 connects..."
    }
  ]
}
```

### `POST /query`

Processes a query through the RAG pipeline.

**Request:**

```json
{
  "query": "How are night routes handled?",
  "top_k": 3
}
```

**Response:**

```json
{
  "retrieved_docs": [
    {
      "id": "scheduling_4",
      "module": "Scheduling",
      "text": "Shifts covering night routes...",
      "score": 0.87
    }
  ],
  "answer": "Night routes must comply with labor agreements..."
}
```

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY` (required): Your OpenAI API key
- `PORT` (optional): Backend port (default: 8000)
- `VITE_API_BASE_URL` (optional): Backend URL for frontend (default: http://localhost:8000)

### Backend Configuration

Edit `backend/src/config.ts` to customize:

- Embedding model (default: `text-embedding-3-small`)
- Chat model (default: `gpt-4o-mini`)
- Default top-k (default: 3)
- Cache file paths

## 📊 How It Works

1. **Document Loading**: On startup, the backend loads documents from `data/dataset.json`

2. **Embedding Creation**:

   - Checks for cached embeddings in `data/embeddings.json`
   - If not found, creates embeddings via OpenAI API and caches them
   - If found, automatically detects new documents in the dataset and embeds only those
   - Loads embeddings into in-memory vector store

3. **Query Processing**:
   - User submits query via frontend
   - Query is embedded using OpenAI
   - Cosine similarity search finds top-K most similar documents
   - Retrieved documents are passed as context to LLM
   - LLM generates answer based on context
   - Response includes both retrieved docs and answer


### Adding New Documents

1. Add documents to `backend/data/dataset.json`
2. Restart the backend service - it will automatically detect and embed only the new documents
   - Note: Delete `backend/data/embeddings.json` only if you want to force re-embedding all documents

## 🧪 Testing

### Manual Testing

1. Start both services
2. Navigate to frontend
3. Verify documents are loaded
4. Submit test queries:
   - "How are night routes handled?"
   - "What is the schedule for Route 1?"
   - "Tell me about driver shifts"

### Health Check

```bash
curl http://localhost:8000/health
```

## 🐛 Troubleshooting

### Backend won't start

- Check that `OPENAI_API_KEY` is set in `.env`
- Verify `data/dataset.json` exists
- Check port 8000 is not in use

### Frontend can't connect to backend

- Verify backend is running
- Check `VITE_API_BASE_URL` matches backend URL
- Check CORS settings in backend

### Embeddings not loading

- Delete `data/embeddings.json` to regenerate
- Check OpenAI API key is valid

## 📚 Technologies Used

- **Backend**: Node.js, TypeScript, Express, OpenAI API
- **Frontend**: React, TypeScript, Vite, Material-UI
- **Deployment**: Docker, Docker Compose, Nginx

## Quick wins / things we can improve fast:
- Add Zod for schema validation
- Caching: use Redis to cache query results
- Indexing: use a vector database with proper indexing
- Async processing: move embedding creation to background jobs


## 👤 Author

Harel Sarag - Built for Optibus GenAI Team assessment
