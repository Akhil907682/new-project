const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllReadByComplaint,
} = require('./notification.controller');
const { protect } = require('../../shared/middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.get('/test', (req, res) => res.json({ message: 'Notification routes are active' }));
router.put('/complaint/:complaintId/read', protect, markAllReadByComplaint);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
