import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pt-32 pb-24"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
          <div>
            <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em] mb-4">Contact Us</p>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">Reach the CampusGuard team.</h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-10">
              For complaint-specific updates, use the dashboard chat. For platform or account help, use the support channels below.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm">
                <Mail className="w-7 h-7 text-indigo-600 mb-5" />
                <h2 className="font-black text-slate-900 mb-2">Email Support</h2>
                <p className="text-slate-500">support@campusguard.local</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm">
                <MapPin className="w-7 h-7 text-indigo-600 mb-5" />
                <h2 className="font-black text-slate-900 mb-2">Campus Office</h2>
                <p className="text-slate-500">Student Services Help Desk</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/50">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">Need case help?</h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              The fastest way to discuss an existing complaint is inside its private chat thread.
            </p>
            <Link
              to="/login"
              className="w-full bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Log In To Chat
            </Link>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default ContactPage;
