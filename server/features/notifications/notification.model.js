const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
    },
    type: {
      type: String,
      enum: ['status_update', 'new_message', 'new_complaint', 'other'],
      default: 'other',
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
