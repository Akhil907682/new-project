const authService = require('./auth.service');

// @desc    Register new admin
// @route   POST /api/auth/register/admin
// @access  Public
const registerAdmin = async (req, res, next) => {
  try {
    const { adminSecretKey } = req.body;
    
    // Check if the provided secret key matches the environment variable
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      res.status(403);
      throw new Error('Invalid Admin Secret Key');
    }

    const user = await authService.registerAdmin(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (!res.statusCode || res.statusCode === 200) res.status(400);
    next(error);
  }
};

// @desc    Register new student
// @route   POST /api/auth/register/student
// @access  Public
const registerStudent = async (req, res, next) => {
  try {
    const user = await authService.registerStudent(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (!res.statusCode || res.statusCode === 200) res.status(400);
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    res.json(user);
  } catch (error) {
    res.status(401);
    next(error);
  }
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400);
      throw new Error('Google credential token is required');
    }
    const user = await authService.googleLogin(credential);
    res.json(user);
  } catch (error) {
    res.status(401);
    next(error);
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerAdmin,
  registerStudent,
  loginUser,
  googleAuth,
  getMe,
};
