const mongoose = require('mongoose');
require('dotenv').config();

// Define light schemas just for counting
const User = mongoose.model('User', new mongoose.Schema({ username: String }), 'users');
const Book = mongoose.model('Book', new mongoose.Schema({ title: String }), 'books');

async function checkResources() {
  try {
    await mongoose.connect(process.env.DB_URI);
    const userCount = await User.countDocuments();
    const bookCount = await Book.countDocuments();
    const users = await User.find({}, 'username');
    
    console.log('--- Database Status ---');
    console.log('Total Users:', userCount);
    console.log('Total Books:', bookCount);
    if (userCount > 0) {
      console.log('User list:', users.map(u => u.username).join(', '));
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

checkResources();
