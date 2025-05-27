const express = require('express');
const { port } = require('./src/config/appConfig');
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const userRoutes = require('./src/routes/userRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const moduleRoutes = require('./src/routes/moduleRoutes');
const certificateRoutes = require('./src/routes/certificateRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const chatbotRoutes = require('./src/routes/chatbotRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
process.removeAllListeners('warning');
process.noDeprecation = true;

// Rete limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Terlalu banyak permintaan, silakan coba lagi nanti.',
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  // origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// Routes
app.use('/auth', limiter, authRoutes);
app.use('/courses', courseRoutes);
app.use('/user', userRoutes);
app.use('/review', reviewRoutes);
app.use('/course', moduleRoutes);
app.use('/course', quizRoutes);
app.use('/course', certificateRoutes);
app.use('/chatbot', chatbotRoutes);
app.use('/admin', adminRoutes);

// app.use('/uploads', express.static(path.join(__dirname, 'src/uploads/courses'))); 
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads/')));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Backend RuangIlmu API is running');
});

// Start server
const appStart = async () => {
  try {
    app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
};

appStart();