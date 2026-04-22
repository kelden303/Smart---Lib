const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

// GET /api/transactions
router.get('/', async (req, res) => {
  try {
    // Populate automatically turns the user/book ObjectId into the actual full object
    const transactions = await Transaction.find()
      .populate('user', '-password') 
      .populate('book');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/transactions/borrow
router.post('/borrow', async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.available < quantity) return res.status(400).json({ message: 'Not enough copies available' });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks default

    const newTrans = new Transaction({
      user: userId,
      book: bookId,
      status: 'borrowed',
      quantity: quantity,
      dueDate: dueDate
    });

    await newTrans.save();

    // Deduct available copies
    book.available -= quantity;
    await book.save();

    const populatedTrans = await Transaction.findById(newTrans._id)
      .populate('user', '-password')
      .populate('book');

    res.status(201).json(populatedTrans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/transactions/return/:id
router.post('/return/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status === 'returned') return res.status(400).json({ message: 'Already returned' });

    transaction.status = 'returned';
    transaction.returnDate = new Date();
    await transaction.save();

    const book = await Book.findById(transaction.book);
    if (book) {
      book.available += transaction.quantity;
      await book.save();
    }

    const populatedTrans = await Transaction.findById(transaction._id)
      .populate('user', '-password')
      .populate('book');

    res.json(populatedTrans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
