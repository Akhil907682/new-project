const express = require('express');
const router = express.Router();
const {
  analyzeComplaint,
  enhanceDescription,
  suggestReplies,
  getDashboardSummary,
  chat,
} = require('./ai.controller');
const { protect, admin } = require('../../shared/middleware/authMiddleware');

router.post('/analyze', protect, analyzeComplaint);
router.post('/enhance', protect, enhanceDescription);
router.post('/chat', protect, chat);
router.get('/suggest-replies/:complaintId', protect, admin, suggestReplies);
router.get('/summary', protect, admin, getDashboardSummary);

module.exports = router;
