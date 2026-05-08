import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Zap, ArrowRight, ShieldCheck, Target, CloudIcon, LineChart } from 'lucide-react';

const FeatureDetailModal = ({ isOpen, onClose, feature }) => {
  if (!feature) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-10">
                <div className="p-5 rounded-3xl bg-indigo-50 text-indigo-600 mb-6 scale-110 shadow-inner">
                  {feature.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] py-1.5 px-4 bg-slate-100 rounded-full text-slate-500 mb-4">
                  {feature.tag} Details
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {feature.title}
                </h2>
              </div>

              {/* Body */}
              <div className="space-y-8">
                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-3">Overview</h3>
                   <p className="text-lg text-slate-600 leading-relaxed font-medium">
                     {feature.longDescription}
                   </p>
                </div>

                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-4">Key Benefits</h3>
                   <div className="grid sm:grid-cols-2 gap-4">
                     {feature.benefits.map((benefit, i) => (
                       <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                           <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                         </div>
                         <span className="font-bold text-slate-700 text-sm">{benefit}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4 text-slate-400">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">Enterprise Ready</span>
                 </div>
                 <button 
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
                 >
                   Getting Started
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeatureDetailModal;
