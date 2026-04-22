const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Ensure passwords are not sent to the frontend
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users - Add a new user
router.post('/', async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    
    // Hash the password if provided
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = new User({
      ...userData,
      password: hashedPassword
    });

    const newUser = await user.save();
    // Re-fetch without password for safety
    const safeUser = await User.findById(newUser._id).select('-password');
    res.status(201).json(safeUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH /api/users/:id/role - Update user role
router.patch('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/users/:id - Remove a user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[DELETE] Request received for user ID: ${id}`);
    
    // Validate MongoDB ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error(`[DELETE] Invalid ID format: ${id}`);
      return res.status(400).json({ message: 'Invalid User ID format. Please refresh and try again.' });
    }

    // Check if user exists first
    const userTodelete = await User.findById(id);
    if (!userTodelete) {
      console.warn(`[ROUTER_DELETE] User ${id} not found in database.`);
      return res.status(404).json({ message: 'Error: User record not found in database. (Code: R404)' });
    }

    console.log(`[ROUTER_DELETE] User found: ${userTodelete.username}. Proceeding...`);
    const result = await User.deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      return res.status(500).json({ message: 'Error: Database deletion failed. (Code: R500)' });
    }

    res.json({ message: 'User removed successfully.' });
  } catch (error) {
    console.error('[DELETE] Critical Error:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

module.exports = router;
