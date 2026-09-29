const User = require('../models/User');
const Category = require('../models/Category');
const generateToken = require('../utils/generateToken');

// Default starter categories created for every newly registered user
const DEFAULT_CATEGORIES = [
  { name: 'Programming', color: '#4F46E5', icon: 'Code', description: 'Core programming languages, syntax, and logic' },
  { name: 'Database', color: '#10B981', icon: 'Database', description: 'SQL, NoSQL, schema design, and indexing' },
  { name: 'AI & Machine Learning', color: '#8B5CF6', icon: 'Cpu', description: 'Machine learning, neural networks, and AI algorithms' },
  { name: 'Web Development', color: '#2563EB', icon: 'Globe', description: 'Frontend, backend, REST APIs, and modern frameworks' },
  { name: 'Mathematics', color: '#F59E0B', icon: 'Calculator', description: 'Linear algebra, calculus, and discrete mathematics' },
  { name: 'Science', color: '#06B6D4', icon: 'Atom', description: 'Physics, computing theories, and research notes' },
  { name: 'Personal', color: '#EC4899', icon: 'User', description: 'Personal ideas, study schedules, and quick thoughts' },
  { name: 'Other', color: '#64748B', icon: 'Folder', description: 'Miscellaneous documentation and reference guides' },
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: 'An account with this email address already exists' });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    // Seed default starter categories for user
    const categoriesToSeed = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      user: user._id,
    }));
    await Category.insertMany(categoriesToSeed);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      bio: user.bio,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        bio: user.bio,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  DEFAULT_CATEGORIES,
};

