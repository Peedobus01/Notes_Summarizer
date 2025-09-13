const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');

const app = express();
const PORT = 5000;

// Hardcoded Configuration
const MONGODB_URI = 'mongodb+srv://Subh005:Sup81@mongo-subh.zgzvv3z.mongodb.net/My_project';
const JWT_SECRET = 'a3f4b8d2e1c9f6a5b7d8e2c1f9a4b6d3e7c1f8a2b5d9e3c6f1a7b4d8e2c9f5a3b6d1e7c4f2';
const GEMINI_API_KEY = 'AIzaSyBl_M8-Il3g81dfMH8A2nSVEXGxP8Cgzh0';

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// User Model with Enhanced Security
const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// PDF Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if(ext !== '.pdf') {
      return cb(new Error('Only PDFs are allowed'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  }
});

// PDF Text Extraction Function
const extractPDFText = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF Text Extraction Error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

// Authentication Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword 
    });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      userId: user._id 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      message: 'Login error', 
      error: error.message 
    });
  }
});

// Protected Route Example
app.get('/api/user-profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user profile', 
      error: error.message 
    });
  }
});

// PDF Upload Route (Protected)
app.post('/api/upload-pdf', authenticateToken, upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Extract text from uploaded PDF
    const extractedText = await extractPDFText(req.file.path);

    // Remove the file after extraction
    fs.unlinkSync(req.file.path);

    res.status(200).json({ 
      message: 'PDF processed successfully', 
      text: extractedText 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing PDF', error: error.message });
  }
});

// Gemini AI Summarization Route (Protected)
app.post('/api/summarize', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    // Validate input
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'No text provided for summarization' });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // List available models for debugging
    try {
      const models = await genAI.listModels();
      console.log('Available Gemini Models:', models.map(model => model.name));
    } catch (modelListError) {
      console.error('Failed to list models:', modelListError);
    }

    // Try multiple model names
    const modelNames = [
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.5-flash",
      "models/gemini-pro"
    ];

    let summary;
    let usedModel;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        // Generate summary with improved prompt
        const prompt = `Please provide a comprehensive summary of the following text. Include:
1. Main topics and key points
2. Important details and insights
3. Conclusion or key takeaways

Text to summarize:
${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        summary = response.text();

        if (summary) {
          usedModel = modelName;
          break;
        }
      } catch (modelError) {
        console.error(`Error with model ${modelName}:`, modelError);
        continue;
      }
    }

    if (!summary) {
      return res.status(500).json({ 
        message: 'Failed to generate summary with any available model',
        availableModels: modelNames
      });
    }

    res.status(200).json({ 
      summary,
      usedModel,
      wordCount: text.split(' ').length,
      summaryWordCount: summary.split(' ').length
    });
  } catch (error) {
    console.error('Summarization Error:', error);
    
    // Provide more detailed error information
    if (error.response) {
      console.error('Gemini API Error:', error.response.status, error.response.data);
      return res.status(500).json({ 
        message: 'Summarization error', 
        error: error.response.data 
      });
    }

    res.status(500).json({ 
      message: 'Summarization error', 
      error: error.message || 'Failed to generate summary',
      fullError: error
    });
  }
});

// NEW: Route to list available models
app.get('/api/models', authenticateToken, async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const models = await genAI.listModels();
    
    res.status(200).json({ 
      models: models.map(model => ({
        name: model.name,
        displayName: model.displayName,
        description: model.description
      }))
    });
  } catch (error) {
    console.error('Models List Error:', error);
    res.status(500).json({ 
      message: 'Error fetching available models', 
      error: error.message 
    });
  }
});

// NEW: Enhanced summarization with different options
app.post('/api/summarize-advanced', authenticateToken, async (req, res) => {
  try {
    const { text, summaryType = 'comprehensive', maxLength = 'medium' } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'No text provided for summarization' });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    let prompt = '';
    
    switch (summaryType) {
      case 'bullet-points':
        prompt = `Create a bullet-point summary of the following text. Use clear, concise bullet points to capture the main ideas:\n\n${text}`;
        break;
      case 'executive':
        prompt = `Create an executive summary of the following text. Focus on key insights, conclusions, and actionable information:\n\n${text}`;
        break;
      case 'brief':
        prompt = `Create a brief, one-paragraph summary of the following text:\n\n${text}`;
        break;
      default:
        prompt = `Create a comprehensive summary of the following text. Include main topics, key points, and important details:\n\n${text}`;
    }

    // Add length instruction
    const lengthInstruction = {
      'short': ' Keep it concise - maximum 100 words.',
      'medium': ' Keep it moderately detailed - maximum 300 words.',
      'long': ' Provide detailed coverage - maximum 500 words.'
    };
    
    prompt += lengthInstruction[maxLength] || lengthInstruction['medium'];

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.status(200).json({ 
      summary,
      summaryType,
      maxLength,
      originalWordCount: text.split(' ').length,
      summaryWordCount: summary.split(' ').length
    });
  } catch (error) {
    console.error('Advanced Summarization Error:', error);
    res.status(500).json({ 
      message: 'Advanced summarization error', 
      error: error.message 
    });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message 
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});