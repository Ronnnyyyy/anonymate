require('dotenv').config();
const express = require('express');
const connectToMongo = require('./db.js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectToMongo();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`The app is running on http://localhost:${port}`);
});
