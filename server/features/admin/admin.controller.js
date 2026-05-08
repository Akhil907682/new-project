const Complaint = require('../complaints/complaint.model');
const Notification = require('../notifications/notification.model');
const sendEmail = require('../../shared/utils/emailService');

// @desc    Get all complaints (Admin only)
// @route   GET /api/admin/complaints
// @access  Private/Admin
const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status (Admin only)
// @route   PUT /api/admin/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = status;
      const updatedComplaint = await complaint.save();
      
      // Send email notification
      try {
        const fullComplaint = await Complaint.findById(complaint._id).populate('userId', 'email name');
        await sendEmail({
          email: fullComplaint.userId.email,
          subject: `Complaint Status Updated: ${fullComplaint.title}`,
          message: `Hello ${fullComplaint.userId.name},\n\nYour complaint "${fullComplaint.title}" status has been updated to "${status}".\n\nThank you for your patience.`,
          html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                  <h2 style="color: #4f46e5;">Status Update</h2>
                  <p>Hello <strong>${fullComplaint.userId.name}</strong>,</p>
                  <p>Your complaint "<strong>${fullComplaint.title}</strong>" status has been updated to: <span style="padding: 4px 8px; background: #fef3c7; color: #92400e; border-radius: 4px; font-weight: bold;">${status}</span></p>
                  <p>We are working hard to resolve all issues as quickly as possible.</p>
                  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                  <p style="font-size: 12px; color: #64748b;">This is an automated notification from CampusGuard SCCS.</p>
                </div>`,
        });
      } catch (err) {
        console.error('Email sending failed:', err.message);
      }
      
      // Create Notification for Student
      try {
        await Notification.create({
          recipient: complaint.userId,
          sender: req.user._id,
          complaintId: complaint._id,
          type: 'status_update',
          message: `Your complaint "${complaint.title}" status has been updated to "${status}".`,
        });
      } catch (err) {
        console.error('Notification creation failed:', err.message);
      }
      
      res.json(updatedComplaint);
    } else {
      res.status(404);
      throw new Error('Complaint not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats (Admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });

    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const priorityStats = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Feedback / Satisfaction stats
    const feedbackAgg = await Complaint.aggregate([
      { $match: { 'feedback.rating': { $exists: true, $ne: null } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$feedback.rating' },
          feedbackCount: { $sum: 1 },
        },
      },
    ]);
    const averageRating = feedbackAgg.length > 0 ? Math.round(feedbackAgg[0].averageRating * 10) / 10 : 0;
    const feedbackCount = feedbackAgg.length > 0 ? feedbackAgg[0].feedbackCount : 0;

    res.json({
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      categoryStats,
      priorityStats,
      averageRating,
      feedbackCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint (Admin only)
// @route   DELETE /api/admin/complaints/:id
// @access  Private/Admin
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      await Complaint.deleteOne({ _id: req.params.id });
      res.json({ message: 'Complaint removed' });
    } else {
      res.status(404);
      throw new Error('Complaint not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllComplaints,
  updateComplaintStatus,
  getDashboardStats,
  deleteComplaint,
};
