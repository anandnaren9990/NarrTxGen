const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ollama API endpoint (assuming Ollama is running locally)
const OLLAMA_API = 'http://localhost:11434/api/generate';

// Function to calculate readability score (simplified)
function calculateReadability(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;
  const totalSentences = sentences.length || 1;
  
  if (totalWords === 0) return 0;
  
  // Simple readability metrics
  const avgWordsPerSentence = totalWords / totalSentences;
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / totalWords;
  
  // Simplified readability score (0-100)
  // Lower values for complex text, higher for readable text
  let score = 100 - (avgWordsPerSentence * 2) - (avgWordLength * 5);
  score = Math.max(0, Math.min(100, score)); // Clamp between 0-100
  
  return Math.round(score);
}

// Endpoint to process narrative text
app.post('/api/process-narrative', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Prepare prompt for LLM
    const prompt = `Analyze the following text and perform these tasks:
1. Identify and replace any gibberish or non-English words with matching english words or if unreadable remove the word.
2. Return only the cleaned, readable English text
3. If the text is mostly gibberish or unreadable, return "UNREADABLE"
4. Do not include any explanations or additional text, only return the cleaned text or "UNREADABLE".

Text to analyze:
"${text}"

Cleaned text (or UNREADABLE):`;

    // Call Ollama API
    let cleanedText = '';
    try {
      const response = await axios.post(OLLAMA_API, {
        model: 'llama2', // or 'llama3' if you have it installed
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3,
          max_tokens: 4000
        }
      }, {
        timeout: 60000 // 60 second timeout
      });

      // Extract only the cleaned text from the response, removing any explanations
      let rawResponse = response.data.response.trim();
      
      // Remove common explanation patterns
      // Look for the actual cleaned text before any explanation markers
      const explanationMarkers = [
        '\n\nExplanation:',
        '\nExplanation:',
        '\n\n1.',
        '\n1.',
        '\nNote:',
        '\n\nNote:'
      ];
      
      for (const marker of explanationMarkers) {
        const index = rawResponse.indexOf(marker);
        if (index !== -1) {
          rawResponse = rawResponse.substring(0, index);
          break;
        }
      }
      
      // Remove "Cleaned text:" prefix if present
      rawResponse = rawResponse.replace(/^Cleaned text:\s*/i, '');
      rawResponse = rawResponse.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
      
      cleanedText = rawResponse.trim();
      
    } catch (ollamaError) {
      console.error('Ollama API Error:', ollamaError.message);
      
      // Fallback: Simple gibberish detection without LLM
      const words = text.split(/\s+/);
      const englishPattern = /^[a-zA-Z'-]+$/;
      const cleanedWords = words.filter(word => {
        const cleanWord = word.replace(/[.,!?;:()]/g, '');
        return englishPattern.test(cleanWord) && cleanWord.length > 1;
      });
      
      if (cleanedWords.length < words.length * 0.3) {
        cleanedText = 'UNREADABLE';
      } else {
        cleanedText = cleanedWords.join(' ');
      }
    }

    // Check if text is unreadable
    if (cleanedText === 'UNREADABLE' || cleanedText.length < 10) {
      return res.json({
        success: false,
        message: 'The provided narrative is non-readable. Please provide the text again in the text box.',
        cleanedText: '',
        readabilityScore: 0,
        originalText: text
      });
    }

    // Calculate readability score
    const readabilityScore = calculateReadability(cleanedText);

    // Check if readability is less than 20%
    if (readabilityScore < 20) {
      return res.json({
        success: false,
        message: 'The provided narrative is non-readable. Please provide the text again in the text box.',
        cleanedText: cleanedText,
        readabilityScore: readabilityScore,
        originalText: text
      });
    }

    // Success response
    res.json({
      success: true,
      message: 'Text processed successfully',
      cleanedText: cleanedText,
      readabilityScore: readabilityScore,
      originalText: text,
      wordsRemoved: text.split(/\s+/).length - cleanedText.split(/\s+/).length
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Failed to process narrative',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Make sure Ollama is running: ollama serve`);
});
