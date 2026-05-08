const Complaint = require('./complaint.model');
const aiService = require('../ai/ai.service');
const sendEmail = require('../../shared/utils/emailService');

const createComplaint = async (complaintData, userId) => {
  if (!complaintData) {
    throw new Error('Complaint data is missing in service');
  }
  const { title, description, category, priority, image } = complaintData;

  let finalPriority = priority;
  let finalCategory = category;

  if (!finalPriority) {
    const analysis = await aiService.analyzeComplaint(description);
    finalPriority = analysis.priority;
    if (!finalCategory || finalCategory === 'Other') {
        finalCategory = analysis.category;
    }
  }

  const complaint = await Complaint.create({
    userId,
    title,
    description,
    category: finalCategory,
    priority: finalPriority,
    image,
  });

  return complaint;
};

const getUserComplaints = async (userId) => {
  const complaints = await Complaint.find({ userId })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  return complaints;
};

const getComplaintById = async (complaintId, userId) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new Error('Complaint not found');
  }

  // Check for ownership unless it's an admin (logic handled in controller usually, but safe here too)
  return complaint;
};

const normalizeExistingMessages = (messages) => {
  messages.forEach((message) => {
    if (!message.senderRole) {
      message.senderRole = message.senderModel === 'Admin' ? 'admin' : 'student';
    }
    if (!message.senderModel) {
      message.senderModel = message.senderRole === 'admin' ? 'Admin' : 'Student';
    }
    if (typeof message.isRead !== 'boolean') {
      message.isRead = false;
    }
    if (!message.senderName) {
      message.senderName = message.senderRole === 'admin' ? 'Admin' : 'Student';
    }
    if (!message.createdAt) {
      message.createdAt = new Date();
    }
  });
};

const addMessageToComplaint = async (complaintId, messageData) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new Error('Complaint not found');
  }

  normalizeExistingMessages(complaint.messages);
  complaint.messages.push({
    ...messageData,
    senderModel: messageData.senderModel || (messageData.senderRole === 'admin' ? 'Admin' : 'Student'),
    senderRole: messageData.senderRole || (messageData.senderModel === 'Admin' ? 'admin' : 'student'),
    senderName: messageData.senderName || 'Participant',
    isRead: typeof messageData.isRead === 'boolean' ? messageData.isRead : false,
    createdAt: messageData.createdAt || new Date(),
  });
  await complaint.save();
  return await Complaint.findById(complaint._id).populate('userId', 'name email');
};

const submitFeedback = async (complaintId, userId, feedbackData) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new Error('Complaint not found');
  }

  // Verify ownership
  if (complaint.userId.toString() !== userId) {
    throw new Error('Not authorized to provide feedback on this complaint');
  }

  // Verify complaint is resolved
  if (complaint.status !== 'Resolved') {
    throw new Error('Feedback can only be provided for resolved complaints');
  }

  // Prevent duplicate feedback
  if (complaint.feedback && complaint.feedback.rating) {
    throw new Error('Feedback has already been submitted for this complaint');
  }

  complaint.feedback = {
    rating: feedbackData.rating,
    comment: feedbackData.comment || '',
    createdAt: new Date(),
  };

  await complaint.save();

  // Trigger Low-Rating Alert for 1 or 2 stars
  if (feedbackData.rating <= 2) {
    try {
      const fullComplaint = await Complaint.findById(complaint._id).populate('userId', 'name email');
      await sendEmail({
        email: process.env.EMAIL_USER, // Notifying the administrator
        subject: `⚠️ Low-Rating Alert: ${fullComplaint.title}`,
        message: `An administrator attention is needed.\n\nA student has submitted a low rating for a resolved complaint.\n\nRating: ${feedbackData.rating}/5 stars\nComment: ${feedbackData.comment || 'No comment provided'}\n\nStudent: ${fullComplaint.userId.name} (${fullComplaint.userId.email})\nComplaint Title: ${fullComplaint.title}`,
        html: `<div style="font-family: sans-serif; padding: 20px; border: 2px solid #ef4444; border-radius: 8px;">
                <h2 style="color: #ef4444;">⚠️ Low-Rating Alert</h2>
                <p>Hello Admin,</p>
                <p>A student has expressed significant dissatisfaction with a resolved issue.</p>
                <div style="background: #fef2f2; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ef4444;">
                  <p><strong>Rating:</strong> <span style="font-size: 18px; color: #ef4444;">${feedbackData.rating} / 5 Stars</span></p>
                  <p><strong>Comment:</strong> <em>"${feedbackData.comment || 'No comment provided'}"</em></p>
                </div>
                <p><strong>Student:</strong> ${fullComplaint.userId.name} (${fullComplaint.userId.email})</p>
                <p><strong>Complaint:</strong> ${fullComplaint.title}</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #64748b;">This alert was automatically generated by CampusGuard SCCS for proactive resolution.</p>
              </div>`,
      });
    } catch (err) {
      console.error('Low-rating alert email failed:', err.message);
    }
  }

  return await Complaint.findById(complaint._id).populate('userId', 'name email');
};

const getPublicFeedback = async (page = 1, limit = 6, category = 'All', sort = 'latest') => {
  const skip = (page - 1) * limit;
  const query = {
    'feedback.rating': { $gte: 4 },
    'feedback.comment': { $ne: '' }
  };
  
  if (category && category !== 'All') {
    query.category = category;
  }

  const sortQuery = sort === 'latest' ? { 'feedback.createdAt': -1 } : { 'feedback.rating': -1 };

  const total = await Complaint.countDocuments(query);
  const feedback = await Complaint.find(query)
    .select('feedback userId createdAt title category')
    .populate('userId', 'name')
    .sort(sortQuery)
    .skip(skip)
    .limit(limit);

  return {
    feedback,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

module.exports = {
  createComplaint,
  getUserComplaints,
  getComplaintById,
  addMessageToComplaint,
  submitFeedback,
  getPublicFeedback,
};
