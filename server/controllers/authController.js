import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'kalasetu_super_secret_jwt_key_2026_artisan_market',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register user (Artisan or Customer only)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'customer',
      languagePreference = 'en',
      businessName,
      bio,
      craftSpecialization,
      state,
      district
    } = req.body;

    // Security rule: Disallow public admin registration
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be created through public registration.'
      });
    }

    // Check existing email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    const userData = {
      name,
      email,
      phone,
      password,
      role,
      languagePreference
    };

    if (role === 'artisan') {
      userData.businessName = businessName || `${name}'s Craft Studio`;
      userData.bio = bio || '';
      userData.craftSpecialization = craftSpecialization || 'Traditional Handcraft';
      userData.state = state || '';
      userData.district = district || '';
    }

    const user = await User.create(userData);
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with this email.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: user.toJSON()
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'name',
      'phone',
      'languagePreference',
      'businessName',
      'bio',
      'craftSpecialization',
      'state',
      'district',
      'profileImage'
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};
