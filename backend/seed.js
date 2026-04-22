const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Book = require('./models/Book');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

dotenv.config();

const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    category: 'Fiction',
    quantity: 5,
    available: 3,
    description: 'A classic American novel set in the Jazz Age',
    publisher: 'Scribner',
    publishedYear: 1925,
    imageUrl: 'https://covers.openlibrary.org/b/id/8406786-L.jpg',
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    category: 'Fiction',
    quantity: 3,
    available: 2,
    description: 'A dystopian social science fiction novel',
    publisher: 'Signet Classic',
    publishedYear: 1949,
    imageUrl: 'https://covers.openlibrary.org/b/id/153256-L.jpg',
  },
  // We will just seed these two to prove it works so the student can add more later
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/smart-lib');
    console.log('Connected to MongoDB. Seeding...');

    // Clear existing
    await Book.deleteMany();
    await User.deleteMany();
    await Transaction.deleteMany();

    // Insert Books
    const createdBooks = await Book.insertMany(books);

    // Create a robust Mock User
    const hashedAdminPassword = await bcrypt.hash('password123', 10);
    const admin = new User({
      username: 'admin',
      password: hashedAdminPassword,
      name: 'Admin User',
      email: 'admin@smartlib.com',
      role: 'admin'
    });
    await admin.save();

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
