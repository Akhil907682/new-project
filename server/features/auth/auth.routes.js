const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  registerStudent,
  loginUser,
  googleAuth,
  getMe,
} = require('./auth.controller');
const { protect } = require('../../shared/middleware/authMiddleware');

router.post('/register/student', registerStudent);
router.post('/register/admin', registerAdmin);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);

module.exports = router;
