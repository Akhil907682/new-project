const complaintService = require('./complaint.service');
// ...
const Complaint = require('./complaint.model');
const sendEmail = require('../../shared/utils/emailService');
const Student = require('../auth/student.model');
const Admin = require('../auth/admin.model');
const Notification = require('../notifications/notification.model');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res, next) => {
  try {
    const complaintData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority,
      image: req.file ? `/uploads/${req.file.filename}` : '',
    };
    
    const complaint = await complaintService.createComplaint(complaintData, req.user.id);
    
    // Send confirmation email
    try {
      const user = await Student.findById(req.user.id);
      await sendEmail({
        email: user.email,
        subject: `Complaint Received: ${complaint.title}`,
        message: `Hello ${user.name},\n\nWe have received your complaint: "${complaint.title}".\nCategory: ${complaint.category}\nPriority: ${complaint.priority}\n\nOur team will review it shortly.`,
        html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #4f46e5;">Complaint Received</h2>
                <p>Hello <strong>${user.name}</strong>,</p>
                <p>We have successfully received your complaint:</p>
                <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <p><strong>Title:</strong> ${complaint.title}</p>
                  <p><strong>Category:</strong> ${complaint.category}</p>
                  <p><strong>Smart Priority:</strong> <span style="color: ${complaint.priority === 'High' ? '#ef4444' : complaint.priority === 'Medium' ? '#f59e0b' : '#3b82f6'};">${complaint.priority}</span></p>
                </div>
                <p>Our maintenance team will review it and update the status soon.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #64748b;">This is an automated confirmation from CampusGuard SCCS.</p>
              </div>`,
      });
    } catch (err) {
      console.error('Initial email failed:', err.message);
    }

    const populatedComplaint = await Complaint.findById(complaint._id).populate('userId', 'name email');
    
    // Notify all Admins about the new complaint
    try {
      const admins = await Admin.find({});
      for (const admin of admins) {
        await Notification.create({
          recipient: admin._id,
          sender: req.user.id,
          complaintId: complaint._id,
          type: 'new_complaint',
          message: `New Complaint Filed: "${complaint.title}" by ${populatedComplaint.userId.name}`,
        });
      }
    } catch (err) {
      console.error('Admin new complaint notification failed:', err.message);
    }

    res.status(201).json(populatedComplaint);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Get user complaints
// @route   GET /api/complaints
// @access  Private
const getUserComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintService.getUserComplaints(req.user.id);
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id);
    
    // Check ownership
    if (complaint.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

const addMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400);
      throw new Error('Please add a message text');
    }

    const complaint = await complaintService.getComplaintById(req.params.id);
    
    // Check authorization: Admin or Owner
    const complaintUserId = (complaint.userId && complaint.userId._id) 
      ? complaint.userId._id.toString() 
      : complaint.userId.toString();
    
    const currentUserId = (req.user && req.user._id)
      ? req.user._id.toString()
      : (req.user && req.user.id)
        ? req.user.id.toString()
        : null;

    const isAdmin = req.user && req.user.role === 'admin';
    const isOwner = currentUserId === complaintUserId;

    if (!isAdmin && !isOwner) {
      res.status(401);
      throw new Error('Not authorized to message on this complaint');
    }

    const messageData = {
      senderId: currentUserId,
      senderModel: req.user.role === 'admin' ? 'Admin' : 'Student',
      senderName: req.user.name,
      senderRole: req.user.role,
      text,
      isRead: false,
      createdAt: new Date(),
    };

    const updatedComplaint = await complaintService.addMessageToComplaint(req.params.id, messageData);
    
    // Create Notification if sender is Admin
    if (isAdmin) {
      try {
        await Notification.create({
          recipient: complaintUserId,
          sender: currentUserId,
          complaintId: complaint._id,
          type: 'new_message',
          message: `Admin ${req.user.name} sent a message on your complaint "${complaint.title}".`,
        });
      } catch (err) {
        console.error('Message notification creation failed:', err.message);
      }
    } else {
      // If sender is Student, notify all Admins
      try {
        const admins = await Admin.find({}); // Find all admins
        for (const admin of admins) {
          await Notification.create({
            recipient: admin._id,
            sender: currentUserId,
            complaintId: complaint._id,
            type: 'new_message',
            message: `Student ${req.user.name} sent a message on complaint "${complaint.title}".`,
          });
        }
      } catch (err) {
        console.error('Admin message notification creation failed:', err.message);
      }
    }
    res.json(updatedComplaint.messages);
  } catch (error) {
    next(error);
  }
};

const addFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400);
      throw new Error('Please provide a valid rating between 1 and 5');
    }

    const updatedComplaint = await complaintService.submitFeedback(
      req.params.id,
      req.user.id,
      { rating, comment }
    );

    res.json(updatedComplaint);
  } catch (error) {
    next(error);
  }
};

const getPublicFeedbacks = async (req, res, next) => {
  try {
    const { page = 1, limit = 6, category = 'All', sort = 'latest' } = req.query;
    const result = await complaintService.getPublicFeedback(page, limit, category, sort);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getUserComplaints,
  getComplaint,
  addMessage,
  addFeedback,
  getPublicFeedbacks,
};
