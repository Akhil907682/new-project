import { motion } from 'framer-motion';
import { FileEdit, Search, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    number: "01",
    title: "Smart Reporting",
    description: "Submit detailed complaints with rich media. Our system uses advanced validation to ensure all critical details are captured.",
    icon: <FileEdit className="w-8 h-8 text-indigo-600" />,
    color: "bg-indigo-50"
  },
  {
    number: "02",
    title: "AI-Powered Triage",
    description: "Integrated Google Gemini AI automatically categorizes, prioritizes, and routes your issue to the correct department for instant action.",
    icon: <Search className="w-8 h-8 text-violet-600" />,
    color: "bg-violet-50"
  },
  {
    number: "03",
    title: "Collaborative Timeline",
    description: "Engage in direct, real-time dialogue with administrators through a secure chat timeline until a verified resolution is reached.",
    icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
    color: "bg-emerald-50"
  }
];

const Process = () => {
  return (
    <section id="process" className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-slate-900 mb-6"
          >
            Resolution reimagined.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            A simple, transparent process designed to close the communication gap and deliver results across campus.
          </motion.p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-12 -z-10"></div>
          
          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center lg:items-start lg:text-left bg-white p-10 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 lg:left-10 lg:translate-x-0 text-slate-100 font-black text-7xl select-none leading-none -z-10 opacity-70">
                {step.number}
              </div>
              
              <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-8 shadow-inner`}>
                {step.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-indigo-50 rounded-full blur-[120px] opacity-40 -z-10 translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

export default Process;
