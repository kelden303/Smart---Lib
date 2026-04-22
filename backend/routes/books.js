const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /api/books - Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/books - Add a new book
router.post('/', async (req, res) => {
  const book = new Book(req.body);
  // Ensure available matches quantity perfectly when newly added
  book.available = book.quantity;
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
