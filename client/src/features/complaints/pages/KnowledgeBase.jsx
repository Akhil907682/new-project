import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Book, Shield, Zap, Tool, HelpCircle, FileText } from 'lucide-react';

const faqData = [
  {
    category: 'General',
    icon: HelpCircle,
    questions: [
      { q: "How long does it take to resolve a complaint?", a: "Most minor maintenance issues are addressed within 24-48 hours. Urgent safety concerns are prioritized and handled immediately." },
      { q: "Can I remain anonymous when filing a report?", a: "While administrators see your name to contact you for details, your identity is never shared publicly or with other students." },
      { q: "What should I do if my complaint is ignored?", a: "If an issue remains 'Pending' for more than 5 days, you can use the AI Support chat to escalate or visit the Student Affairs office." }
    ]
  },
  {
    category: 'Hostel & Housing',
    icon: Shield,
    questions: [
      { q: "What is the curfew for hostel residents?", a: "The official campus curfew is 10:30 PM. For emergency late entries, please coordinate with your floor warden via the portal." },
      { q: "How do I report a water leakage in my room?", a: "File a new complaint under the 'Plumbing' category. Attach a photo of the leakage to help our team bring the right tools." }
    ]
  },
  {
    category: 'Academics & Facilities',
    icon: Book,
    questions: [
      { q: "How can I request a library book renewal?", a: "Library renewals are handled through the separate Library Portal, but you can report issues with library seating or lighting here." },
      { q: "What are the lab operating hours?", a: "Central labs are open from 8:00 AM to 8:00 PM on weekdays and 10:00 AM to 4:00 PM on Saturdays." }
    ]
  },
  {
    category: 'Maintenance & IT',
    icon: Zap,
    questions: [
      { q: "Why is the campus Wi-Fi slow today?", a: "Scheduled maintenance often happens on Sunday nights. Check the 'Announcements' section for planned downtime alerts." },
      { q: "Who handles electrical repairs in classrooms?", a: "Electrical repairs are managed by the Estate Maintenance Department. Categorize your report as 'Electrical' for the fastest response." }
    ]
  }
];

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('General');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const filteredFaqs = faqData.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header & Search */}
      <div className="text-center space-y-6">
        <div className="inline-flex p-4 bg-indigo-50 rounded-3xl border border-indigo-100">
          <Book className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Knowledge Base</h1>
          <p className="text-slate-500 mt-2 font-medium">Quick answers to common questions about campus life.</p>
        </div>
        
        <div className="relative max-w-xl mx-auto group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for rules, guides, or issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 text-lg transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {faqData.map((cat) => (
          <button
            key={cat.category}
            onClick={() => { setActiveCategory(cat.category); setExpandedIndex(null); }}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
              activeCategory === cat.category 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'
            }`}
          >
            <cat.icon className="w-5 h-5" />
            <span className="font-bold text-sm">{cat.category}</span>
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-2">
          {filteredFaqs.find(c => c.category === activeCategory)?.questions.map((faq, idx) => (
            <div key={idx} className="border-b border-slate-50 last:border-0">
              <button
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors text-left"
              >
                <span className="font-bold text-slate-800 pr-8">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-slate-600 leading-relaxed font-medium bg-slate-50/30">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="p-12 text-center space-y-4">
              <HelpCircle className="w-12 h-12 text-slate-200 mx-auto" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching results found</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black">Still have questions?</h3>
            <p className="text-slate-400 font-medium">Our AI-Powered support is here to help 24/7.</p>
          </div>
          <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
            Chat with AI
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default KnowledgeBase;
