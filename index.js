const express = require('express');
const connectToMongo = require('./db.js');

connectToMongo();

const app = express();
const port = 5000;

app.use('/api/auth',require('./routes/auth'));
app.use('/api/chat',require('./routes/chat'));

app.listen(port,()=>{
    console.log(`The app is running on http://localhost:${port}`);
});