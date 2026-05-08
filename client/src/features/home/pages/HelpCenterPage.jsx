import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, FilePlus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HelpCenterPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pt-32 pb-24"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em] mb-4">Help Center</p>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">Get around CampusGuard faster.</h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Quick answers for filing complaints, tracking progress, using chat, and sending feedback after resolution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: FilePlus, title: 'File a complaint', text: 'Open the student dashboard and use File a Complaint to submit the issue details and optional evidence.' },
            { icon: MessageSquare, title: 'Message on a case', text: 'Use Chat to continue a complaint-specific conversation with the admin team.' },
            { icon: HelpCircle, title: 'Track status', text: 'Pending, In Progress, and Resolved tabs show where each complaint currently stands.' },
            { icon: Star, title: 'Leave feedback', text: 'Resolved complaints can be rated from the dashboard when feedback is still available.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <item.icon className="w-8 h-8 text-indigo-600 mb-5" />
              <h2 className="text-xl font-black text-slate-900 mb-3">{item.title}</h2>
              <p className="text-slate-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-indigo-600 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black mb-2">Need to check an existing issue?</h2>
            <p className="text-indigo-100">Open your dashboard to view the latest status and messages.</p>
          </div>
          <Link
            to={user ? dashboardPath : '/login'}
            className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black hover:bg-slate-50 transition-colors"
          >
            {user ? 'Open Dashboard' : 'Log In'}
          </Link>
        </div>
      </div>
    </motion.main>
  );
};

export default HelpCenterPage;
