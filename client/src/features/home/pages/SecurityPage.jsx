import { motion } from 'framer-motion';
import { Lock, ShieldCheck, EyeOff, BellRing } from 'lucide-react';

const SecurityPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pt-32 pb-24"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-3xl mb-16">
          <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em] mb-4">Platform Security</p>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">Built for trusted campus reporting.</h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            CampusGuard protects complaint data with authenticated access, role-based dashboards, evidence handling, and audit-friendly communication history.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: ShieldCheck, title: 'Role-based access', text: 'Students and admins see separate dashboards, routes, and actions based on their account role.' },
            { icon: Lock, title: 'Protected complaint records', text: 'Complaint details, evidence, and messages stay inside authenticated workflows.' },
            { icon: EyeOff, title: 'Private communication', text: 'Thread conversations are scoped to the complaint owner and authorized administrators.' },
            { icon: BellRing, title: 'Tracked notifications', text: 'Unread states help users know which complaint updates still need attention.' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <item.icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-3">{item.title}</h2>
              <p className="text-slate-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
};

export default SecurityPage;
