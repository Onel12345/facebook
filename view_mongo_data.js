require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB (Fixed: Removed deprecated options)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define the Schema (Must Match `index.js`)
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    timestamp: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Fetch & Display Users
async function fetchUsers() {
    try {
        console.log('🔍 Fetching stored users from MongoDB...');
        const users = await User.find();

        if (users.length === 0) {
            console.log('⚠️ No users found in the database.');
        } else {
            console.log('📜 Stored Users:', users);
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('❌ Error Fetching Users:', err);
        mongoose.connection.close();
    }
}

fetchUsers();
