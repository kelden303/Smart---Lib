const mongoose = require('mongoose');

// User Schema - Defines the structure of Library Users (Students/Admins)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true }, // Added for your previous login logic
  password: { type: String, required: true },               // Kept for your previous login logic
  phone: { type: String },
  role: { type: String, enum: ['student', 'teacher', 'admin', 'normal'], default: 'student' },
  department: { type: String },
  enrollmentNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
