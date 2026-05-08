const aiService = require('./ai.service');
const Complaint = require('../complaints/complaint.model');

// @desc    Analyze text for priority and category
// @route   POST /api/ai/analyze
// @access  Private
const analyzeComplaint = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    const analysis = await aiService.analyzeComplaint(text);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
};

// @desc    Enhance description text
// @route   POST /api/ai/enhance
// @access  Private
const enhanceDescription = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    const enhancedText = await aiService.enhanceDescription(text);
    res.json({ enhancedText });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI reply suggestions for a complaint
// @route   GET /api/ai/suggest-replies/:complaintId
// @access  Private/Admin
const suggestReplies = async (req, res, next) => {
  try {
    // Only admins should use this
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const suggestions = await aiService.generateReplySuggestions({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      status: complaint.status
    });

    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI dashboard summary
// @route   GET /api/ai/summary
// @access  Private/Admin
const getDashboardSummary = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Fetch the last 50 complaints for context
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('title category priority status');

    const summary = await aiService.generateWeeklySummary(recentComplaints);
    res.json({ summary });
  } catch (error) {
    next(error);
  }
};

// @desc    Chatbot interaction
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res, next) => {
  try {
    const { history = [], message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const reply = await aiService.chatbotResponse(history, message);
    res.json({ reply });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeComplaint,
  enhanceDescription,
  suggestReplies,
  getDashboardSummary,
  chat,
};
