const authRoutes = require('./routes/auth'); //wiring auth route

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const testRoutes = require('./routes/test'); // testing token on Postman
const path = require('path'); // so frontend can load uploaded images
const bookRoutes = require('./routes/bookRoutes'); // to get books
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Test Route

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
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5500;  //environment port variable
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
