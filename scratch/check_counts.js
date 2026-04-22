const mongoose = require('mongoose');
const User = require('./backend/models/User');
const Book = require('./backend/models/Book');
require('dotenv').config();

async function checkResources() {
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
  process.exit();
}

checkResources();
