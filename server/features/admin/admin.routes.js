const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  updateComplaintStatus,
  getDashboardStats,
  deleteComplaint,
} = require('./admin.controller');
const { protect, admin } = require('../../shared/middleware/authMiddleware');

router.get('/complaints', protect, admin, getAllComplaints);
router.put('/complaints/:id', protect, admin, updateComplaintStatus);
router.delete('/complaints/:id', protect, admin, deleteComplaint);
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
