const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the recommended model for text tasks
const getModel = () => genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

/**
 * AI Service to handle all interactions with Google Gemini API
 */

// 1. Smart Priority and Category Detection
const analyzeComplaint = async (description) => {
  if (!description || description.trim() === '') {
    return { priority: 'Low', category: 'Other' };
  }

  const model = getModel();
  
  const prompt = `
  You are an intelligent triage assistant for a university campus complaint management system.
  Analyze the following complaint description and determine its Priority and Category.
  
  Categories allowed: "Electrical", "Plumbing", "Carpentry", "Internet", "Housekeeping", "Other".
  Priorities allowed: "Low", "Medium", "High".
  
  High priority is for emergencies, safety hazards, leaks, or severe disruptions.
  Medium priority is for broken items, inconveniences, or localized outages.
  Low priority is for minor requests, cleaning, or cosmetic issues.
  
  Complaint Description: "${description}"
  
  Return ONLY a valid JSON object with no markdown formatting, exactly in this format:
  {"priority": "Low/Medium/High", "category": "CategoryName"}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean up potential markdown formatting (e.g., ```json ... ```)
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }

    try {
      const parsed = JSON.parse(text);
      return {
        priority: ['Low', 'Medium', 'High'].includes(parsed.priority) ? parsed.priority : 'Low',
        category: ['Electrical', 'Plumbing', 'Carpentry', 'Internet', 'Housekeeping', 'Other'].includes(parsed.category) ? parsed.category : 'Other',
      };
    } catch (e) {
      console.error('Failed to parse Gemini JSON:', text);
      return { priority: 'Low', category: 'Other' };
    }
  } catch (error) {
    console.error('AI Analysis failed:', error);
    return { priority: 'Low', category: 'Other' }; // Fallback
  }
};

// 2. Enhance Description
const enhanceDescription = async (text) => {
  if (!text || text.trim() === '') return text;

  const model = getModel();
  const prompt = `
  Rewrite the following user complaint description to be more professional, clear, and actionable for a maintenance team.
  Fix any grammar or spelling mistakes. Keep the tone polite but urgent if the original text implies urgency.
  Do not add fabricated details, just improve what is there.
  Return ONLY the rewritten text, without any conversational filler or quotes.
  
  Original text: "${text}"
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('AI Enhancement failed:', error);
    return text; // Return original if failed
  }
};

// 3. Generate Reply Suggestions for Admins
const generateReplySuggestions = async (complaintContext) => {
  const model = getModel();
  const prompt = `
  You are an assistant helping an administrator reply to a student's campus complaint.
  
  Complaint Details:
  Title: ${complaintContext.title}
  Description: ${complaintContext.description}
  Category: ${complaintContext.category}
  Status: ${complaintContext.status}
  
  Generate 3 short, professional, and empathetic reply templates the admin can send to the student.
  Options should vary in tone:
  1. Acknowledgment that the issue is received and being looked into.
  2. Asking for more specific details or a photo if needed.
  3. Informing them that maintenance is on the way or scheduled.
  
  Return ONLY a valid JSON array of strings, exactly like this:
  ["Option 1 text...", "Option 2 text...", "Option 3 text..."]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('AI Reply Suggestion failed:', error);
    return [
      "We have received your complaint and are looking into it.",
      "Could you please provide more details or a photo of the issue?",
      "Our maintenance team has been notified and will address this shortly."
    ];
  }
};

// 4. Generate Dashboard Summary
const generateWeeklySummary = async (recentComplaintsData) => {
  if (!recentComplaintsData || recentComplaintsData.length === 0) {
    return "Not enough data to generate an AI summary this week.";
  }

  const model = getModel();
  
  // Condense data to save tokens
  const condensedData = recentComplaintsData.map(c => 
    `[${c.category}] ${c.title} (${c.priority} Priority) - Status: ${c.status}`
  ).join('\n');

  const prompt = `
  You are an AI data analyst for a campus facilities team.
  Analyze the following list of recent complaints and provide a short, executive summary (max 3-4 sentences).
  Highlight any notable trends (e.g., a spike in a specific category), overall priority distribution, and areas that might need administrative focus.
  Keep it professional, insightful, and concise.

  Recent Data:
  ${condensedData}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('AI Summary failed:', error);
    return "AI analysis is currently unavailable. Please check back later.";
  }
};

// 5. Chatbot Assistant
const chatbotResponse = async (history, currentMessage) => {
  const model = getModel();
  
  // Format history for Gemini API
  const formattedHistory = history.map(msg => ({
    role: msg.sender === 'bot' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: `You are "Guardy", the official AI assistant for CampusGuard, a premium university complaint management system. 
        Your goal is to help students understand and navigate the platform's features.
        
        KEY FEATURES OF CAMPUSGUARD:
        1. **File a Complaint**: Students can report issues (Electrical, Plumbing, IT, etc.). They can upload photos and use "AI Enhance" to make their descriptions more professional.
        2. **My Dashboard**: A central hub to track all your complaints. Statuses include: 
           - Pending: Received but not yet started.
           - In Progress: A maintenance team is currently working on it.
           - Resolved: The issue is fixed!
        3. **My Impact**: A special page where students see their contribution to the campus. It features:
           - **Impact Score**: Points earned for filing and resolving issues.
           - **Badges**: "Community Voice" (for filing 3 complaints) and "Issue Solver" (for 5 resolutions).
           - **Hero Recognition**: Shows how many other students were helped by your reports.
        4. **Real-time Notifications**: You'll get a bell notification the moment an admin updates your complaint.
        5. **Smart Triage**: Our AI automatically detects the priority (Low, Medium, High) of every complaint to ensure urgent issues are fixed first.

        TONE & GUIDELINES:
        - Be friendly, encouraging, and professional.
        - Keep responses concise and use bullet points for clarity.
        - If a student describes a problem, tell them: "That sounds important! You should head over to the 'File a Complaint' tab to report this officially so the maintenance team can see it."
        - Do not promise exact fix times, but emphasize that the Admin team is active.` }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am the CampusGuard AI assistant, ready to help students.' }]
      },
      ...formattedHistory
    ],
  });

  try {
    const result = await chat.sendMessage(currentMessage);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('AI Chatbot failed:', error);
    return "I'm sorry, I'm having trouble connecting to my neural network right now. Please try again later!";
  }
};

module.exports = {
  analyzeComplaint,
  enhanceDescription,
  generateReplySuggestions,
  generateWeeklySummary,
  chatbotResponse,
};
