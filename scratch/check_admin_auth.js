const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../backend/models/User');
require('dotenv').config();

async function checkAdmin() {
  await mongoose.connect(process.env.DB_URI);
  const admin = await User.findOne({ username: 'admin' });
  if (admin) {
    console.log('Admin user found');
    const isMatch = await bcrypt.compare('password123', admin.password);
    console.log('Password "password123" matches:', isMatch);
    
    if (!isMatch) {
      console.log('Resetting admin password to "password123"...');
      admin.password = await bcrypt.hash('password123', 10);
      await admin.save();
      console.log('Admin password reset successfully');
    }
  } else {
    console.log('Admin user not found. Creating...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const newAdmin = new User({
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
      email: 'admin@smartlib.com',
      role: 'admin'
    });
    await newAdmin.save();
    console.log('Admin user created successfully');
  }
  await mongoose.disconnect();
}

checkAdmin().catch(console.error);
