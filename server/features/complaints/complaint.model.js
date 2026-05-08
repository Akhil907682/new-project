const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Electrical', 'Plumbing', 'Carpentry', 'Internet', 'Housekeeping', 'Other'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High'],
    },
    image: {
      type: String,
      default: '',
    },
    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'messages.senderModel',
          required: true,
        },
        senderModel: {
          type: String,
          required: true,
          enum: ['Student', 'Admin']
        },
        senderName: {
          type: String,
          required: true,
        },
        senderRole: {
          type: String,
          enum: ['student', 'admin'],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        default: '',
      },
      createdAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
