import React from 'react';
import { MessageSquare, Cpu, MessageCircle, LineChart } from 'lucide-react';

export const FEATURE_DATA = [
  {
    icon: <MessageSquare className="w-8 h-8 text-indigo-600" />,
    title: "Smart Issue Reporting",
    description: "Submit campus complaints with rich media evidence. Our streamlined interface ensures your concerns are documented clearly and professionally.",
    longDescription: "The student experience is at the heart of CampusGuard. Our reporting system allows students to attach photos, select categories, and provide detailed descriptions. This ensures that administrative staff have all the context they need to begin resolution without unnecessary back-and-forth.",
    benefits: ["Photo evidence support", "Categorized submissions", "Draft saving capability"],
    tag: "Submission"
  },
  {
    icon: <Cpu className="w-8 h-8 text-indigo-600" />,
    title: "AI-Powered Triage",
    description: "Leverage Google Gemini AI to automatically categorize and prioritize complaints, ensuring urgent campus issues are addressed immediately.",
    longDescription: "Bypass the manual sorting process. Our integration with Google Gemini AI analyzes the content of every complaint to assign priority levels (Low, Medium, High) and categorize issues. This ensures that critical infrastructure or security problems are flagged for administrative attention within seconds.",
    benefits: ["Automated prioritization", "AI-driven sentiment analysis", "Smart categorization"],
    tag: "Intelligence"
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-indigo-600" />,
    title: "Interactive Chat Timeline",
    description: "Experience direct, real-time communication with campus administrators. Clarify issues and track resolution progress through a transparent messaging system.",
    longDescription: "Every complaint generates a dedicated, secure communication channel. Students and administrators can message each other directly to provide updates, ask for clarifications, or share resolution proof. This transparency builds trust and significantly reduces the time-to-resolve.",
    benefits: ["Real-time messaging", "Resolution proof sharing", "Full communication audit"],
    tag: "Communication"
  },
  {
    icon: <LineChart className="w-8 h-8 text-indigo-600" />,
    title: "Insightful Admin Panel",
    description: "Comprehensive analytics and trend identification. Administrators can monitor the campus pulse and optimize resolution workflows with real-time data.",
    longDescription: "Transform individual complaints into institutional intelligence. The Admin Command Center provides a high-level overview of campus issues, identifying trends in specific departments or categories. Use data to allocate resources effectively and prevent systemic issues before they escalate.",
    benefits: ["Dynamic trend charts", "Status overview cards", "AI-generated executive summaries"],
    tag: "Management"
  }
];
