const express = require('express');
const multer = require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for admin login state
app.use(session({
  secret: 'h2ok_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));
// Serve uploaded images statically from "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store uploads in /uploads
  },
  filename: function (req, file, cb) {
    // Prefix filename with timestamp for uniqueness
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// In-memory storage for submitted reports
let reports = [];

// Endpoint to handle report submissions from guests
app.post('/submit-report', upload.single('photo'), (req, res) => {
  const { name, location, quality, description } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: 'No photo uploaded.' });
  }
  const imageUrl = '/uploads/' + req.file.filename;
  // Save report data in memory
  reports.push({ name, location, quality, description, imageUrl });
  res.json({ message: 'Report submitted successfully!' });
});

// Admin login endpoint (hardcoded credentials)
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Hardcoded credentials: admin / password123
  if (username === 'admin' && password === 'password123') {
    req.session.isAdmin = true;
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Endpoint to fetch all submitted reports (admin only)
app.get('/reports', (req, res) => {
  if (req.session.isAdmin) {
    res.json(reports);
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
