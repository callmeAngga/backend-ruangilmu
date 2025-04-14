const express = require('express');
const { port } = require('./src/config/appConfig');
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const app = express();
const cors = require('cors');


process.noDeprecation = true;

app.use(cors({ origin: 'http://127.0.0.1:5500' })); // Allow requests from this origin

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);

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