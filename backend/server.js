const authRoutes = require('./routes/auth'); //wiring auth route

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Test Route

app.use('/api/auth', authRoutes);
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
