# 📘 AI Notes Summarizer

## 🚀 Project Overview
An AI-powered notes summarization application that helps students quickly revise important concepts from their study materials.

### Key Features
- 👤 User Authentication (Signup/Login)
- 📄 PDF Upload & Text Extraction
- 🤖 AI-Powered Summarization
- 💾 Secure Data Storage

## 🛠️ Technologies Used
- **Frontend:** React (Vercel)
- **Backend:** Node.js + Express (Railway)
- **Database:** MongoDB Atlas
- **AI:** Google Gemini API
- **Authentication:** JWT
- **File Handling:** Multer

## ⚙️ Prerequisites
- Node.js v16 or later
- npm (included with Node.js)
- MongoDB Atlas account
- Gemini API Key

## 📦 Setup Instructions

### Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs at: http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
React app runs at: http://localhost:3000

### Environment Configuration
1. Create `.env` in backend directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

2. Create `.env` in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏗️ System Architecture

### Data Models

#### User Schema
```javascript
{
  username: String,
  email: String,
  password: String, // hashed
  createdAt: Date
}
```

### Component Structure
- 🔐 Authentication
  - Login
  - Signup
- 📊 Dashboard
  - PDF Upload
  - Summary Display
- 🔄 API Integration
  - PDF Processing
  - Gemini AI Summarization

## 🔐 Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Environment variables for secrets
- Secure file upload handling
- Temporary PDF storage

## 📝 API Documentation

### Authentication Endpoints
- POST `/api/signup` - Create new user
- POST `/api/login` - User login
- GET `/api/user-profile` - Get user profile

### PDF Processing
- POST `/api/upload-pdf` - Upload PDF
- POST `/api/summarize` - Generate summary

## 🚀 Deployment
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

## 📸 Demo
[Add screenshots or demo video link here]

## 🔄 Development Workflow
1. Clone repository
2. Set up environment variables
3. Install dependencies
4. Start development servers

## 📋 TODO
- [ ] Advanced error handling
- [ ] Enhanced PDF text extraction
- [ ] Improved summarization accuracy
- [ ] User preferences storage

## 👥 Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request
