const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  updateUserPassword
} = require('../controllers/user.controller');

// Protected routes (require authentication)
router.use(protect);

// Get all users
router.get('/', getAllUsers);

// Get user statistics
router.get('/stats', getUserStats);

// Get single user
router.get('/:id', getUserById);

// Create new user
router.post('/', createUser);

// Update user
router.put('/:id', updateUser);

// Update user password
router.patch('/:id/password', updateUserPassword);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router; 