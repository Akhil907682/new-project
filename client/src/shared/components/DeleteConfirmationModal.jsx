import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 15, stiffness: 400 }}
          className="relative bg-white rounded-[2.5rem] p-8 shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden"
        >
          {/* Danger Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Warning Icon Animation */}
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-red-100/50"
              />
              <AlertTriangle className="w-10 h-10 text-red-600 relative z-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">Are you absolutely sure?</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              You are about to delete <span className="font-bold text-slate-900">"{itemName}"</span>. 
              This action is permanent and cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={onClose}
                className="py-4 px-6 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Now
              </button>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
