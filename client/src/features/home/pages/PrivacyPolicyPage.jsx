import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Information We Use',
    text: 'CampusGuard stores account details, complaint descriptions, evidence uploads, status changes, feedback, and complaint-specific messages needed to operate the resolution workflow.',
  },
  {
    title: 'How It Is Used',
    text: 'Data is used to route complaints, notify the right participants, maintain a communication record, and help administrators understand campus maintenance patterns.',
  },
  {
    title: 'Who Can Access It',
    text: 'Students can access their own complaints and conversations. Administrators can access complaint records needed for triage, response, and resolution.',
  },
  {
    title: 'Retention',
    text: 'Complaint records remain available in the system for accountability and service history unless an authorized administrator removes them.',
  },
];

const PrivacyPolicyPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pt-32 pb-24"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-14">
          <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em] mb-4">Privacy Policy</p>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">Clear handling of campus report data.</h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            This page summarizes how CampusGuard handles information inside the complaint and resolution workflow.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100">
          {sections.map((section) => (
            <section key={section.title} className="p-8">
              <h2 className="text-xl font-black text-slate-900 mb-3">{section.title}</h2>
              <p className="text-slate-500 leading-relaxed">{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </motion.main>
  );
};

export default PrivacyPolicyPage;
