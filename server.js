const express = require('express');
const { port } = require('./src/config/appConfig');
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const userRoutes = require('./src/routes/userRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const moduleRoutes = require('./src/routes/moduleRoutes');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const path = require('path');



process.noDeprecation = true;

app.use(cors({ 
  origin: 'http://127.0.0.1:5500',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
 }));

// Middleware
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/user', userRoutes);
app.use('/review', reviewRoutes);
app.use('/module', moduleRoutes); 

app.use('/src/uploads/courses', express.static(path.join(__dirname, 'src/uploads/courses'))); 


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