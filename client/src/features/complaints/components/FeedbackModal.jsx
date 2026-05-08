import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, Sparkles } from 'lucide-react';
import { submitFeedback } from '../complaintSlice';

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
const RATING_COLORS = ['', 'text-red-500', 'text-orange-500', 'text-amber-500', 'text-lime-500', 'text-emerald-500'];

const FeedbackModal = ({ isOpen, onClose, complaintId }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeRating = hoveredRating || rating;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    try {
      await dispatch(submitFeedback({ complaintId, rating, comment })).unwrap();
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        // Reset state for next use
        setRating(0);
        setComment('');
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setSubmitted(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {submitted ? (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full" />
                  <div className="relative w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-12 h-12 text-emerald-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                  Thank You!
                </h3>
                <p className="text-slate-500 font-medium text-lg">
                  Your feedback helps us improve campus services.
                </p>
              </motion.div>
            ) : (
              /* Form State */
              <div className="p-8 md:p-12">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Star className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
                    Share Your Experience
                  </h3>
                  <p className="text-slate-500 font-medium">
                    How would you rate the resolution of your complaint?
                  </p>
                </div>

                {/* Star Rating */}
                <div className="flex flex-col items-center mb-8">
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 transition-colors"
                      >
                        <Star
                          className={`w-10 h-10 transition-all duration-200 ${
                            star <= activeRating
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                              : 'text-slate-200'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  <motion.div
                    key={activeRating}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-6"
                  >
                    {activeRating > 0 && (
                      <span className={`text-sm font-black uppercase tracking-[0.2em] ${RATING_COLORS[activeRating]}`}>
                        {RATING_LABELS[activeRating]}
                      </span>
                    )}
                  </motion.div>
                </div>

                {/* Comment */}
                <div className="mb-8">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us more about your experience..."
                    rows={3}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={rating === 0 || isSubmitting}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl ${
                    rating === 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-indigo-600 text-white hover:bg-slate-900 shadow-indigo-200'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Feedback
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
