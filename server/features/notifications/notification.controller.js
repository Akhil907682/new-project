const Notification = require('./notification.model');
const Complaint = require('../complaints/complaint.model');

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name')
      .populate('complaintId', 'title')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      if (notification.recipient.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
      }

      notification.isRead = true;
      await notification.save();
      res.json(notification);
    } else {
      res.status(404);
      throw new Error('Notification not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications for a complaint as read
// @route   PUT /api/notifications/complaint/:complaintId/read
// @access  Private
const markAllReadByComplaint = async (req, res, next) => {
  try {
    console.log(`[NOTIF] Marking all read for complaint: ${req.params.complaintId}, user: ${req.user._id}`);
    
    // 1. Mark notifications as read
    const notificationResult = await Notification.updateMany(
      { 
        recipient: req.user._id, 
        complaintId: req.params.complaintId,
        isRead: { $ne: true },
      },
      { isRead: true }
    );

    // 2. Mark messages as read in the complaint
    // If the user is an admin, mark student messages as read
    // If the user is a student, mark admin messages as read
    const otherRole = req.user.role === 'admin' ? 'student' : 'admin';
    
    const messageResult = await Complaint.updateOne(
      { _id: req.params.complaintId },
      { 
        $set: { "messages.$[elem].isRead": true } 
      },
      { 
        arrayFilters: [{ "elem.senderRole": otherRole, "elem.isRead": { $ne: true } }] 
      }
    );

    console.log(`[NOTIF] Done. Notifications updated: ${notificationResult.modifiedCount}, complaints updated: ${messageResult.modifiedCount}`);
    res.json({
      message: 'Notifications and messages marked as read',
      notificationsUpdated: notificationResult.modifiedCount,
      complaintsUpdated: messageResult.modifiedCount,
    });
  } catch (error) {
    console.error('[NOTIF] Error in markAllReadByComplaint:', error);
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllReadByComplaint,
};
