const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('connections', 'name email')
      .populate('followers', 'name email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/posts
// @desc    Get posts by user ID
// @access  Public
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Get user posts error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name', 'Name is required').not().isEmpty().trim(),
  body('bio', 'Bio must be less than 500 characters').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, bio } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/connect
// @desc    Connect with a user (follow)
// @access  Private
router.put('/:id/connect', auth, async (req, res) => {
  try {
    const userToConnect = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToConnect) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot connect with yourself' });
    }

    // Check if already connected
    const isConnected = currentUser.connections.includes(req.params.id);
    const isFollower = userToConnect.followers.includes(req.user.id);

    if (isConnected) {
      // Disconnect (unfollow)
      currentUser.connections = currentUser.connections.filter(
        id => id.toString() !== req.params.id
      );
      userToConnect.followers = userToConnect.followers.filter(
        id => id.toString() !== req.user.id
      );
    } else {
      // Connect (follow)
      currentUser.connections.push(req.params.id);
      userToConnect.followers.push(req.user.id);
    }

    await Promise.all([currentUser.save(), userToConnect.save()]);

    // Populate the updated user data
    await currentUser.populate('connections', 'name email');
    await currentUser.populate('followers', 'name email');

    res.json({
      user: currentUser,
      isConnected: !isConnected,
      message: isConnected ? 'Disconnected successfully' : 'Connected successfully'
    });
  } catch (error) {
    console.error('Connection error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/connection-status
// @desc    Check if current user is connected with another user
// @access  Private
router.get('/:id/connection-status', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const isConnected = currentUser.connections.includes(req.params.id);

    res.json({ isConnected });
  } catch (error) {
    console.error('Connection status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users
// @desc    Get all users (for search functionality)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('name email bio createdAt')
      .limit(20)
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 