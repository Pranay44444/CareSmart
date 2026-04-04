const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper ───────────────────────────────────────────────────────────────────

/**
 * generateToken
 * Creates a signed JWT for the given user ID. Expires in 7 days.
 * @param {string} id - MongoDB user _id
 * @returns {string} signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ── Shared response shape ────────────────────────────────────────────────────

const userPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  deviceProfile: user.deviceProfile,
  createdAt: user.createdAt,
});

// ── Controllers ──────────────────────────────────────────────────────────────

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    // Create user (password is hashed by the pre-save hook in User model)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      // Only allow 'admin' role if explicitly set AND you trust the caller (add your own guard here)
      role: role === 'admin' ? 'admin' : 'user',
    });

    res.status(201).json({
      message: 'Account created successfully',
      token: generateToken(user._id),
      user: userPayload(user),
    });
  } catch (error) {
    console.error('Register error:', error);

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @desc    Login user & return token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Fetch user with password (schema has select: false)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: userPayload(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @desc    Get current logged-in user's profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    // req.user is already attached by the protect middleware (no password)
    res.status(200).json({ user: userPayload(req.user) });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

/**
 * @desc    Update the authenticated user's device profile
 * @route   PUT /api/auth/device-profile
 * @access  Private
 */
const updateDeviceProfile = async (req, res) => {
  try {
    const { deviceType, brand, model, usagePattern } = req.body;

    if (!deviceType && !brand && !model && !usagePattern) {
      return res.status(400).json({ message: 'Provide at least one device profile field to update' });
    }

    // Build update object with only provided fields
    const profileUpdate = {};
    if (deviceType)    profileUpdate['deviceProfile.deviceType']    = deviceType.trim();
    if (brand)         profileUpdate['deviceProfile.brand']         = brand.trim();
    if (model)         profileUpdate['deviceProfile.model']         = model.trim();
    if (usagePattern)  profileUpdate['deviceProfile.usagePattern']  = usagePattern.trim();

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: profileUpdate },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Device profile updated successfully',
      user: userPayload(updatedUser),
    });
  } catch (error) {
    console.error('Update device profile error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ message: 'Server error updating device profile' });
  }
};

module.exports = { register, login, getProfile, updateDeviceProfile };
