const cors = require('cors'); // to allow request from backend to frontend in different ports.

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // so frontend can load uploaded images
const testRoutes = require('./routes/test'); // testing token on Postman
const authRoutes = require('./routes/auth'); // wiring auth route
const bookRoutes = require('./routes/bookRoutes');
// to get books
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Test Route
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/test', testRoutes);
app.use('/api/books', bookRoutes);
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5500; // environment port variable
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
