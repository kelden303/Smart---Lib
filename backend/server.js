require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import Models Early to avoid ReferenceErrors
const User = require('./models/User');
const Book = require('./models/Book');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Global Request Logger for Debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Connect to MongoDB
// Database connection caching helper for Vercel Serverless environment
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.DB_URI) {
    throw new Error('DB_URI environment variable is missing.');
  }

  // Set timeout options so Mongoose fails quickly in serverless instead of hanging for 30s
  cachedConnection = await mongoose.connect(process.env.DB_URI, {
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout
  });

  console.log('Connected to MongoDB');
  
  // Ensure Admin User Exists
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    console.log('No admin found. Creating default admin...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
      email: 'admin@smartlib.com',
      role: 'admin'
    });
    console.log('Default admin created: admin / password123');
  }

  // Seed books if collection is empty
  const bookCount = await Book.countDocuments();
  if (bookCount === 0) {
    console.log('Seeding initial book collection...');
    const newBestSellers = [
      {
        title: "The Women",
        author: "Kristin Hannah",
        isbn: "9781250178633",
        category: "Historical Fiction",
        quantity: 10,
        available: 10,
        description: "A story of a nurse during the Vietnam War, exploring the heroism and sacrifice of women who served.",
        publisher: "St. Martin's Press",
        publishedYear: 2024,
        imageUrl: "https://images-na.ssl-images-amazon.com/images/P/1250178630.01.LZZZZZZZ.jpg"
      },
      {
        title: "A Court of Thorns and Roses",
        author: "Sarah J. Maas",
        isbn: "9781635575569",
        category: "Fantasy",
        quantity: 8,
        available: 8,
        description: "A huntress becomes entangled in the world of the fae in this epic fantasy romance.",
        publisher: "Bloomsbury Publishing",
        publishedYear: 2020,
        imageUrl: "https://images-na.ssl-images-amazon.com/images/P/1635575567.01.LZZZZZZZ.jpg"
      },
      {
        title: "The Scarlet Shedder (Dog Man #12)",
        author: "Dav Pilkey",
        isbn: "9781338801910",
        category: "Children's Fiction",
        quantity: 15,
        available: 15,
        description: "The latest adventure of Dog Man, the hero who is part dog and part man.",
        publisher: "Graphix",
        publishedYear: 2024,
        imageUrl: "https://images-na.ssl-images-amazon.com/images/P/1338801915.01.LZZZZZZZ.jpg"
      },
      {
        title: "The Housemaid",
        author: "Freida McFadden",
        isbn: "9781538749449",
        category: "Thriller",
        quantity: 12,
        available: 12,
        description: "A twisty psychological thriller about a housemaid who learns a family's dark secrets.",
        publisher: "Grand Central Publishing",
        publishedYear: 2022,
        imageUrl: "https://images-na.ssl-images-amazon.com/images/P/1538749446.01.LZZZZZZZ.jpg"
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        isbn: "9780735211292",
        category: "Self-Help",
        quantity: 20,
        available: 20,
        description: "A proven framework for improving every day through tiny habits.",
        publisher: "Avery",
        publishedYear: 2018,
        imageUrl: "https://images-na.ssl-images-amazon.com/images/P/0735211299.01.LZZZZZZZ.jpg"
      },
      {
        title: "It Ends with Us",
        author: "Colleen Hoover",
        isbn: "9781501110368",
        category: "Romance",
        quantity: 10,
        available: 10,
        description: "A poignant story about domestic violence and the strength it takes to leave.",
        publisher: "Atria Books",
        publishedYear: 2016,
        imageUrl: "https://images-na.ssl-images-amazon.com/images/P/1501110365.01.LZZZZZZZ.jpg"
      },
      {
        title: "Iron Flame",
        author: "Rebecca Yarros",
        isbn: "9781649374172",
        category: "Fantasy",
        quantity: 7,
        available: 7,
        description: "The thrilling sequel to Fourth Wing, continuing the dragon rider saga.",
        publisher: "Entangled: Red Tower Books",
        publishedYear: 2023,
        imageUrl: "https://images-na.ssl-images-amazon.com/images/P/1649374178.01.LZZZZZZZ.jpg"
      },
      {
        title: "Fourth Wing",
        author: "Rebecca Yarros",
        isbn: "9781649374042",
        category: "Fantasy",
        quantity: 7,
        available: 7,
        description: "A dragon-riding academy fantasy that captured the world's imagination.",
        publisher: "Entangled: Red Tower Books",
        publishedYear: 2023,
        imageUrl: "https://images-na.ssl-images-amazon.com/images/P/1649374046.01.LZZZZZZZ.jpg"
      },
      {
        title: "A Court of Mist and Fury",
        author: "Sarah J. Maas",
        isbn: "9781635575583",
        category: "Fantasy",
        quantity: 8,
        available: 8,
        description: "The stunning sequel to A Court of Thorns and Roses.",
        publisher: "Bloomsbury Publishing",
        publishedYear: 2020,
        imageUrl: "https://images-na.ssl-images-amazon.com/images/P/1635575583.01.LZZZZZZZ.jpg"
      },
      {
        title: "It Starts with Us",
        author: "Colleen Hoover",
        isbn: "9781668001226",
        category: "Romance",
        quantity: 10,
        available: 10,
        description: "The long-awaited sequel to the global phenomenon It Ends with Us.",
        publisher: "Atria Books",
        publishedYear: 2022,
        imageUrl: "https://images-na.ssl-images-amazon.com/images/P/1668001225.01.LZZZZZZZ.jpg"
      }
    ];
    await Book.insertMany(newBestSellers);
    console.log('Successfully seeded 10 books!');
  }

  return cachedConnection;
}

// Middleware to ensure DB connection is active before processing requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error in middleware:', error);
    res.status(500).json({ 
      message: 'Failed to connect to database. Please check DB_URI and Atlas configuration.', 
      error: error.message 
    });
  }
});

// Mount Routes
app.use('/api/books', require('./routes/books'));
app.use('/api/users', require('./routes/users'));
app.use('/api/transactions', require('./routes/transactions'));

// Direct Fallback for User Deletion
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  const { password, name, email, phone, role, department, enrollmentNumber } = req.body;
  const username = req.body.username?.trim();
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: 'Username or Email already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username, password: hashedPassword, name, email, phone, role, department, enrollmentNumber
    });
    
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body;
  const username = req.body.username?.trim();
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '2h' }
    );
    
    res.status(200).json({ 
      token, 
      user: { 
        _id: user._id, username: user.username, name: user.name, role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { newPassword, username, email } = req.body;
  try {
    const user = await User.findOne({ username, email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Root/Status endpoint for deployment checks
app.get('/', (req, res) => {
  res.send('Smart-Lib API is running successfully!');
});

// Start Server conditionally (only when run directly)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
  });
}

// Export Express app for Vercel Serverless Functions
module.exports = app;