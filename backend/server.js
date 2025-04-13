const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const eventRoutes = require('./routes/eventRoutes');
const goalRoutes = require('./routes/goalRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialize express
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://calender-br3ajozel-mayeraas-projects.vercel.app', 'https://calender-br3ajozel-mayeraas-projects.vercel.app'] 
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Add middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/calendar-app')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', taskRoutes);

// API health check
app.get('/api', (req, res) => {
  res.json({ message: 'Calendar API is running' });
});

// For Vercel, we need to export the app as a module instead of starting the server directly
if (process.env.NODE_ENV === 'production') {
  // In production, don't start the server here - Vercel will handle it
  console.log('Running in production mode');
} else {
  // In development, start the server directly
  const PORT = process.env.PORT || process.env.API_PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app; 