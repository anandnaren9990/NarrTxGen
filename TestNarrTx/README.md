# NarrativeTx - Setup and Running Guide

## Overview
NarrativeTx uses an Angular frontend and Node.js backend with LLAMA (via Ollama) to analyze narrative text, remove gibberish words, and check readability.

## Prerequisites

### 1. Install Ollama
```bash
# On macOS
brew install ollama

# Or download from https://ollama.ai/
```

### 2. Pull LLAMA Model
```bash
ollama pull llama2
```

### 3. Start Ollama Service
```bash
ollama serve
```

## Installation Steps

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install
```

### Frontend Setup
```bash
# From project root
npm install
```

## Running the Application

### Terminal 1: Start Ollama
```bash
ollama serve
```

### Terminal 2: Start Backend Server
```bash
cd server
npm start
```
Server will run on http://localhost:3000

### Terminal 3: Start Angular Frontend
```bash
npm start
```
Frontend will run on http://localhost:4200

## How It Works

1. **Input Text**: User enters narrative text (up to 4000 characters)
2. **Click "Get Suggestion"**: Sends text to backend
3. **LLM Processing**: LLAMA analyzes text and removes gibberish words
4. **Readability Check**: Calculates readability score
5. **Display Results**:
   - If readability < 20%: Shows error message
   - If readable: Shows cleaned text, readability score, and words removed
   - Copy cleaned text to clipboard

## Features

- ✅ Remove non-English/gibberish words using LLAMA
- ✅ Calculate readability score
- ✅ Display error if readability < 20%
- ✅ Show cleaned text with statistics
- ✅ Copy cleaned text to clipboard
- ✅ Character counter (4000 max)
- ✅ Responsive design

## Troubleshooting

### Backend Connection Error
- Ensure backend server is running on port 3000
- Check that Ollama is running: `ollama serve`
- Verify LLAMA model is installed: `ollama list`

### CORS Issues
- Backend has CORS enabled for localhost:4200
- If issues persist, check browser console

### Ollama Not Found
```bash
# Check if Ollama is installed
which ollama

# If not installed
brew install ollama
```

## API Endpoints

### POST /api/process-narrative
Process narrative text

**Request:**
```json
{
  "text": "Your narrative text here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Text processed successfully",
  "cleanedText": "Cleaned text",
  "readabilityScore": 75,
  "wordsRemoved": 5
}
```

**Response (Low Readability):**
```json
{
  "success": false,
  "message": "The provided narrative is non-readable. Please provide the text again in the text box.",
  "cleanedText": "",
  "readabilityScore": 15
}
```

## Tech Stack

- **Frontend**: Angular 17, TypeScript
- **Backend**: Node.js, Express
- **LLM**: LLAMA 2 (via Ollama)
- **Styling**: CSS with gradient design
