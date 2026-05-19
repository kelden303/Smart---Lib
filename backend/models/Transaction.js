const mongoose = require('mongoose');

// Transaction Schema - Tracks who borrowed which book and when
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['borrowed', 'returned'], required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  fine: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'none'], default: 'none' },
  quantity: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
