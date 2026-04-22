const mongoose = require('mongoose');

// Book Schema - Defines the structure of Library Books
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  available: { type: Number, required: true, default: 1 },
  description: { type: String },
  publisher: { type: String },
  publishedYear: { type: Number },
  imageUrl: { type: String }, // For storing covers
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
