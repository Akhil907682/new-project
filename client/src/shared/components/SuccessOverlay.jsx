import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';

const SuccessOverlay = ({ isOpen, message, subMessage, onClose, type = 'success' }) => {
  const isDanger = type === 'danger';
  
  // Tailwind config object to avoid dynamic class generation issues
  const theme = {
    success: {
      bg: 'bg-emerald-500/10',
      ring: 'bg-emerald-50',
      border: 'border-emerald-100',
      inner: 'bg-emerald-100/50',
      bar: 'bg-emerald-500',
      text: 'text-emerald-600'
    },
    danger: {
      bg: 'bg-red-500/10',
      ring: 'bg-red-50',
      border: 'border-red-100',
      inner: 'bg-red-100/50',
      bar: 'bg-red-500',
      text: 'text-red-600'
    }
  }[type] || theme.success;

  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const checkTimeout = setTimeout(() => setShowCheck(true), 150);
      const closeTimeout = setTimeout(() => onClose(), 1500);
      return () => {
        clearTimeout(checkTimeout);
        clearTimeout(closeTimeout);
      };
    } else {
      setShowCheck(false);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white rounded-[3rem] p-12 shadow-2xl max-w-sm w-full text-center border border-slate-100 relative overflow-hidden"
        >
          <div className={`absolute -top-24 -right-24 w-48 h-48 ${theme.bg} rounded-full blur-3xl animate-pulse`} />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />

          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-32 h-32 mx-auto mb-8 relative flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`absolute inset-0 rounded-full ${theme.ring} border-2 ${theme.border}`}
            />
            
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`absolute inset-4 rounded-full ${theme.inner}`}
            />

            {isDanger ? (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={showCheck ? { scale: 1, rotate: 0 } : {}}
                className={`relative z-10 ${theme.text}`}
              >
                <Trash2 className="w-16 h-16" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <svg
                className={`w-16 h-16 ${theme.text} relative z-10`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={showCheck ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          
          <div className="space-y-3 relative z-10">
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black text-slate-900 tracking-tight"
            >
              {message || 'Success!'}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed px-4"
            >
              {subMessage || 'Your action has been processed successfully.'}
            </motion.p>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-50 overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.5, ease: "linear" }}
              className={`h-full ${theme.bar}`}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuccessOverlay;
