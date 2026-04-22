const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config();

async function checkUser() {
  await mongoose.connect(process.env.DB_URI);
  const user = await User.findOne({ username: 'jig' });
  if (user) {
    console.log('User found:', user.username);
  } else {
    console.log('User not found');
  }
  process.exit();
}

checkUser();
