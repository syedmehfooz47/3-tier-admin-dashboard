const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routers/authRoutes');
const userRoutes = require('./routers/userRoutes');
const seedSuperAdmin = require('./database/seeder');

const app = express();
const PORT = process.env.PORT || 9000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/admin_db';

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Health check endpoint (used by Docker depends_on)
app.get('/', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'admin-dashboard-api' });
});

// Database Connection & Server Start
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    
    // Seed initial data if necessary
    await seedSuperAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
