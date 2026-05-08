import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, MessageSquare, CheckCircle, User, ArrowRight, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublicFeedback } from '../../complaints/complaintSlice';

const Testimonials = () => {
  const dispatch = useDispatch();
  const { publicFeedback, isLoading } = useSelector((state) => state.complaint);

  useEffect(() => {
    dispatch(getPublicFeedback({ page: 1, limit: 3 }));
  }, [dispatch]);

  const getAnonymizedName = (name) => {
    if (!name) return 'Student';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0]} ${parts[parts.length - 1][0]}.`;
    }
    return name;
  };

  if (isLoading && publicFeedback.length === 0) {
     return null;
  }

  if (publicFeedback.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6"
            >
              <LayoutGrid className="w-4 h-4" />
              Impact & Transparency
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
            >
              Student Feedback on <br />
              <span className="text-indigo-600">Resolved Complaints</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-500 text-lg font-medium"
            >
              Real stories from verified students after their issues were successfully resolved.
            </motion.p>
          </div>
          
          <Link to="/feedback">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 shadow-xl shadow-indigo-900/5"
            >
              View Full Feedback Wall
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicFeedback.slice(0, 3).map((item, index) => (
            <FeedbackCard key={item._id} item={item} index={index} getAnonymizedName={getAnonymizedName} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeedbackCard = ({ item, index, getAnonymizedName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] relative group h-full flex flex-col"
    >
      <div className="absolute top-8 right-8 inline-flex items-center gap-1 px-3 py-1 bg-white text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm">
        Complaint Feedback
      </div>

      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
            <CheckCircle className="w-3 h-3" />
            Resolved
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
          {item.title}
        </h3>

        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < item.feedback.rating
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-200'
              }`}
            />
          ))}
        </div>

        <p className="text-slate-600 font-medium leading-relaxed mb-8 italic line-clamp-3">
          &quot;{item.feedback.comment}&quot;
        </p>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-slate-200/50 mt-auto">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
           {item.userId?.name?.[0] || 'S'}
        </div>
        <div>
          <h4 className="text-slate-900 font-bold text-sm">
            {getAnonymizedName(item.userId?.name)}
          </h4>
          <p className="text-indigo-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <User className="w-3 h-3" /> Verified Student
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Testimonials;
