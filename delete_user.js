require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    timestamp: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Get argument from command line
const identifier = process.argv[2];

if (!identifier) {
    console.log('⚠️ Please provide a user ID or username to delete.');
    process.exit(1);
}

// Delete user by `_id` or `username`
async function deleteUser() {
    try {
        let result;

        if (mongoose.Types.ObjectId.isValid(identifier)) {
            // If the input looks like an ObjectId, try deleting by `_id`
            result = await User.findByIdAndDelete(identifier);
        }
        
        if (!result) {
            // If no user was deleted by `_id`, try deleting by `username`
            result = await User.findOneAndDelete({ username: identifier });
        }

        if (result) {
            console.log(`✅ Deleted user: ${identifier}`);
        } else {
            console.log(`⚠️ No user found with ID or username: ${identifier}`);
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('❌ Error deleting user:', err);
        mongoose.connection.close();
    }
}

deleteUser();
