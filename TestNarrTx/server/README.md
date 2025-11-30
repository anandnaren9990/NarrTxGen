# NarrativeTx Backend Server

## Prerequisites

1. **Install Ollama** (for running LLAMA locally)
   - Visit: https://ollama.ai/
   - Download and install Ollama for macOS
   - Or use: `brew install ollama`

2. **Pull LLAMA model**
   ```bash
   ollama pull llama2
   ```

3. **Start Ollama service**
   ```bash
   ollama serve
   ```

## Installation

```bash
cd server
npm install
```

## Running the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on http://localhost:3000

## API Endpoints

### POST /api/process-narrative
Process narrative text and remove gibberish words

**Request Body:**
```json
{
  "text": "Your narrative text here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Text processed successfully",
  "cleanedText": "Cleaned text without gibberish",
  "readabilityScore": 75,
  "originalText": "Original text",
  "wordsRemoved": 5
}
```

### GET /api/health
Check server status
