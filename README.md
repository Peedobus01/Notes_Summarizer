# 📘 AI Notes Summarizer

## 👤 Author
- **Name**: Subhodeep Paul  
- **University**: Indian Institute of Technology Guwahati (IITG)  
- **Department**: Mechanical Engineering  

---

## 🚀 Project Overview
**AI Notes Summarizer** is a web application that helps students quickly summarize their lecture slides or notes.  
It allows users to:
- Create an account (Signup/Login)
- Upload lecture slides or notes in **PDF format**
- Extract raw text from PDFs
- Generate **concise summaries** using Google Gemini AI  

This tool is designed to save time during exam preparation by automatically condensing key topics, formulas, and takeaways.  

---

## 📋 Features
- 🔐 **User Authentication** (Signup/Login with JWT)  
- 📂 **PDF Upload & Text Extraction**  
- 🤖 **AI-powered Text Summarization** (Gemini API)  
- 🎨 **Simple and Intuitive UI**  

---

## 📸 Screenshots

### 🔹 Login Page
![Login Page](./vivid/screenshots./login.png)

### 🔹 Signup Page
![Signup Page](./vivid/screenshots./signup.png)

### 🔹 Dashboard (PDF Upload)
![Dashboard](./vivid/screenshots./dashboard.png)

### 🔹 Summary Output
![Summary](./vivid/screenshots./summary.png)

---

## 🎥 Demo Video (Optional)
👉 You can upload a short walkthrough video (2–3 mins) to YouTube or Google Drive and paste the link here.  

**Demo Video Link:** [Upload your demo video here]  

---

## 🛠️ Technologies Used
- **Frontend**: React (deployed on Vercel)  
- **Backend**: Node.js + Express (deployed on Railway)  
- **Database**: MongoDB Atlas (cloud-hosted)  
- **AI Integration**: Google Gemini API  
- **Authentication**: JWT-based login system  
- **File Handling**: Multer (for PDF uploads)  

---

### 🌐 Live Deployment
The project is already deployed and accessible online:
- Frontend (Vercel): [https://your-frontend.vercel.app](https://your-frontend.vercel.app)  
- Backend (Railway): [https://your-backend.up.railway.app](https://your-backend.up.railway.app)  

To run the project locally follow the below instructions

### Backend Setup
cd backend
npm install
npm start

### Frontend Setup
cd frontend
npm install
npm start

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

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- File upload validation
- Rate limiting
- Input sanitization

## Error Handling
- Comprehensive error messages
- Client-side validation
- Server-side validation
- File type and size validation
- API error handling

## Future Enhancements
- [ ] Advanced summarization options
- [ ] Multiple file upload support
- [ ] Summary history
- [ ] Export functionality
- [ ] Custom AI model selection
- [ ] Enhanced error reporting
- [ ] User preferences
- [ ] Analytics dashboard

## Acknowledgments
- Google Gemini AI for providing the summarization capabilities
- PDF-Parse for PDF text extraction
- MongoDB for database services






