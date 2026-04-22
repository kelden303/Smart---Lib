require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
mongoose.connect(process.env.DB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Add missing interesting books by ISBN
    console.log('Checking for missing interesting books...');
    // Clear existing books to start fresh as requested
    console.log('Clearing old books collection...');
    await Book.deleteMany({});

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
    console.log('Successfully seeded 10 new best-selling books!');
  })
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Import Models
const User = require('./models/User');
const Book = require('./models/Book');

// Import our new routes
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const transactionsRouter = require('./routes/transactions');

// Mount Routes under /api/*
app.use('/api/books', require('./routes/books'));
app.use('/api/users', require('./routes/users'));
app.use('/api/transactions', require('./routes/transactions'));

// Direct Fallback for User Deletion to bypass any router issues
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[SERVER_DIRECT_DELETE] Attempting to remove user: ${id}`);
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'Error: User not found in fallback route. (Code: S404)' });
    res.json({ message: 'User deleted successfully via fallback.' });
  } catch (error) {
    res.status(500).json({ message: `Fallback Error: ${error.message}` });
  }
});

// Base Route
app.get('/', (req, res) => {
  res.send('Backend is running with full DB Integration!');
});

// Auth Routes kept intact
app.post('/api/auth/signup', async (req, res) => {
  const { password, name, email, phone, role, department, enrollmentNumber } = req.body;
  const username = req.body.username?.trim();
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: 'User with this username or email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username, 
      password: hashedPassword, 
      name,
      email,
      phone,
      role,
      department,
      enrollmentNumber
    });
    
    const savedUser = await newUser.save();
    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        name: savedUser.name,
        role: savedUser.role,
        email: savedUser.email,
        phone: savedUser.phone,
        department: savedUser.department,
        enrollmentNumber: savedUser.enrollmentNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body;
  const username = req.body.username?.trim();
  console.log(`Login attempt for username: "${username}"`);
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User not found: "${username}"`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log(`User found: ${user.username}, comparing password...`);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Invalid password for user: "${username}"`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`Login successful for user: "${username}". Generating token...`);
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    
    // We send back the user object without the password
    const safeUser = { 
      _id: user._id, 
      username: user.username, 
      name: user.name, 
      role: user.role,
      email: user.email,
      phone: user.phone,
      department: user.department,
      enrollmentNumber: user.enrollmentNumber
    };
    res.status(200).json({ message: 'Login successful!', token, user: safeUser });
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { newPassword } = req.body;
  const username = req.body.username?.trim();
  const email = req.body.email?.trim();
  try {
    const user = await User.findOne({ username, email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid username or email combination.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
});

// Middleware to Verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Catch-all 404 for debugging
app.use((req, res) => {
  console.warn(`[404_DETECTED] No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `API Route not found: ${req.method} ${req.originalUrl}` });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
  console.log('Registered Routes:');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/auth/signup');
  console.log('- DELETE /api/users/:id');
});