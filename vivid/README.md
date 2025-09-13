# AI Notes Summarizer

## Project Overview
An AI-powered notes summarization application that allows users to upload PDFs and get concise summaries using Gemini AI.

## Prerequisites
- Node.js (v14 or later)
- MongoDB
- Gemini API Key

## API Key Configuration

### Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Set the API key in your environment or directly in the `server.js` file

#### Option 1: Environment Variable (Recommended)
```bash
# For Windows (PowerShell)
$env:GEMINI_API_KEY='your_api_key_here'

# For Unix/Mac
export GEMINI_API_KEY='your_api_key_here'
```

#### Option 2: Direct Configuration
In `backend/server.js`, replace:
```javascript
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your_gemini_api_key_here';
```
with your actual API key.

## Setup Instructions

### Backend Setup
1. Navigate to backend directory
```bash
cd backend
npm install
```

2. Configure your Gemini API Key (see above)

3. Start the backend server
```bash
npm start
```

### Frontend Setup
1. Navigate to frontend directory
```bash
cd frontend
npm install
```

2. Start the React development server
```bash
npm start
```

## Features
- User Authentication (Signup/Login)
- PDF Upload
- AI-powered Text Summarization
- Simple and Intuitive UI

## Technologies Used
- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB
- AI Integration: Gemini API

## Security Notes
- NEVER commit API keys to version control
- Use environment variables for sensitive configuration
- Rotate API keys periodically

## TODO
- Implement advanced error handling
- Add password encryption
- Enhance PDF text extraction
- Improve summarization accuracy
