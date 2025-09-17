# AI Notes Summarizer

## Author
- **Name**: Subhodeep Paul
- **University**: Indian Institute of Technology, Guwahati (IITG)
- **Department**: Mechanical Engineering

---

## Project Overview
**AI Notes Summarizer** is a web application that helps students quickly summarize their lecture slides or notes. 
It allows users to:
- Create an account (Signup/Login)
- Upload lecture slides or notes in **PDF format**
- Extract raw text from PDFs
- Generate **concise summaries** using Google Gemini AI

This tool is designed to save time during exam preparation by automatically condensing key topics, formulas, and takeaways.  

---

## Features
- **User Authentication** (Signup/Login with JWT)  
- **PDF Upload & Text Extraction**  
- **AI-powered Text Summarization** (Gemini API)  
- **Simple and Intuitive UI**  

---

## Screenshots

### 🔹 Login Page
![Login Page](./vivid/screenshots./login.png)

### 🔹 Signup Page
![Signup Page](./vivid/screenshots./signup.png)

### 🔹 Dashboard (PDF Upload)
![Dashboard](./vivid/screenshots./dashboard.png)

### 🔹 Summary Output
![Summary](./vivid/screenshots./summary.png)  

---

## Technologies Used
- **Frontend**: React (deployed on Vercel)  
- **Backend**: Node.js + Express (deployed on Railway)  
- **Database**: MongoDB Atlas (cloud-hosted)  
- **AI Integration**: Google Gemini API  
- **Authentication**: JWT-based login system  
- **File Handling**: Multer (for PDF uploads)  

---

### Live Deployment
The project is already deployed and accessible online:
- Frontend (Vercel): [https://notes-summarizer-coral.vercel.app/login](https://notes-summarizer-coral.vercel.app/login)  
- Backend (Railway): [notessummarizer-production.up.railway.app](notessummarizer-production.up.railway.app)  

To run the project locally follow the below instructions

---

## Prerequisites
- Node.js (v14 or later)
- MongoDB
- Gemini API Key

### Gemini API Configuration
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Configure the API key:

```bash
# For Windows (PowerShell)
$env:GEMINI_API_KEY='your_api_key_here'

# For Unix/Mac
export GEMINI_API_KEY='your_api_key_here'
```
---

## Installation

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## Application Structure
```
project/
├── backend/
│   ├── server.js          # Express server configuration
│   ├── package.json       # Backend dependencies
│   └── uploads/           # Temporary PDF storage
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── App.js        # Main application component
│   └── package.json      # Frontend dependencies
└── README.md
```

### Authentication
- `POST /api/signup`: User registration
- `POST /api/login`: User authentication
- `GET /api/user-profile`: Get user profile

### Document Processing
- `POST /api/upload-pdf`: PDF upload and text extraction
- `POST /api/summarize`: Text summarization
- `POST /api/summarize-advanced`: Advanced summarization options

---

## Development Interaction Logs (with AI Assistants)

After setting up the project structure (React frontend + Express/MongoDB backend), I used AI to streamline code generation for specific modules.

**Prompt Example (for backend auth):**  
*"Build login and signup endpoints in Express.js using JWT authentication and MongoDB as the database."*

**AI Response (excerpt):**  
"Here’s the Express code for `/signup` and `/login` routes with password hashing using bcrypt and JWT token generation..."  

- - -

**Prompt Example (for frontend API integration):**  
*"Write an `api.js` file for the frontend that connects to the backend using axios. Handle login, signup, PDF upload, and text summarization with JWT authentication."*

**AI Response (excerpt):**  
"Here’s the corrected `api.js`:  
```javascript
import axios from 'axios';
const API_URL = 'https://notessummarizer-production.up.railway.app/api';
..."
```

- - -

###  Prototype Interaction Logs (with Gemini AI)

Once the project was functional, I tested PDF uploads and summarization. Below is a sample:

**Prompt Sent to Gemini:**  
"Please provide a comprehensive summary of the following text.  

Text to summarize:  
Dynamics of Machinery – Static force analysis, Dynamic force analysis, Turning moment diagrams, Flywheels, Balancing."

**Gemini AI Response:**  
"Summary:  
1. Static force analysis – equilibrium of forces  
2. Dynamic force analysis – includes inertia forces  
3. Turning moment diagrams – study fluctuation of torque  
4. Flywheels – regulate speed variations  
5. Balancing – reduces vibration from unbalanced parts"

---

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- File upload validation
- Rate limiting
- Input sanitization

---

## Error Handling
- Comprehensive error messages
- Client-side validation
- Server-side validation
- File type and size validation
- API error handling

---

## Future Enhancements
- Advanced summarization options
- Multiple file upload support
- Summary history
- Export functionality
- Custom AI model selection
- Enhanced error reporting
- User preferences
- Analytics dashboard

---

## Acknowledgments
- Google Gemini AI for providing the summarization capabilities
- PDF-Parse for PDF text extraction
- MongoDB for database services

---
