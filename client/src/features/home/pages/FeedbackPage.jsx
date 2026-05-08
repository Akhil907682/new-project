import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, MessageSquare, CheckCircle, User, 
  ArrowLeft, ChevronLeft, ChevronRight, Filter, 
  LayoutGrid, ListFilter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublicFeedback } from '../../complaints/complaintSlice';

const FeedbackPage = () => {
  const dispatch = useDispatch();
  const { publicFeedback, publicFeedbackPagination, isLoading } = useSelector((state) => state.complaint);
  
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('latest');

  const categories = ['All', 'Hostel', 'Academic', 'Infrastructure', 'Security', 'Electrical', 'Others'];

  useEffect(() => {
    dispatch(getPublicFeedback({ page, limit: 9, category, sort }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, page, category, sort]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= publicFeedbackPagination.pages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm shadow-indigo-100"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Impact & Transparency
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight"
            >
              Student Feedback on <br />
              <span className="text-indigo-600 text-6xl md:text-8xl italic">Resolved Complaints</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed"
            >
              See what students say after their issues are successfully resolved. 
              Our commitment is to turn every grievance into a success story.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm mb-12">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl text-slate-400 mr-2">
                <Filter className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">Category</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    category === cat 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
               <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl text-slate-400">
                <ListFilter className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Sort</span>
              </div>
              <select 
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="latest">Latest Feedback</option>
                <option value="highest">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Total Count Badge */}
        {!isLoading && (
          <div className="mb-8 flex items-center justify-between">
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
              Showing {publicFeedback?.length || 0} of {publicFeedbackPagination?.total || 0} Verified Feedbacks
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="w-12 h-12 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-sm font-bold animate-pulse">Loading resolution stories...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {publicFeedback.map((item, index) => (
                <FeedbackCard key={item._id} item={item} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && publicFeedback.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No feedback found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your filters or category selection.</p>
          </div>
        )}

        {/* Pagination Section */}
        {!isLoading && publicFeedbackPagination.pages > 1 && (
          <div className="mt-20 flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <PaginationButton 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                icon={<ChevronLeft />}
                label="Prev"
              />
              
              <div className="flex items-center gap-2 mx-4">
                {[...Array(publicFeedbackPagination.pages)].map((_, i) => {
                  const p = i + 1;
                  // Simple range logic
                  if (p === 1 || p === publicFeedbackPagination.pages || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                          page === p 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                          : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  }
                  if (p === 2 || p === publicFeedbackPagination.pages - 1) {
                    return <span key={p} className="text-slate-300 px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <PaginationButton 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === publicFeedbackPagination.pages}
                icon={<ChevronRight />}
                label="Next"
              />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Page {page} of {publicFeedbackPagination.pages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const FeedbackCard = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 3) * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 transition-all relative group h-full flex flex-col"
    >
      <div className="absolute top-8 right-8 inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-wider">
        Complaint Feedback
      </div>

      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
            <CheckCircle className="w-3 h-3" />
            Resolved
          </div>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {item.category}
          </span>
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

        <p className="text-slate-600 font-medium leading-relaxed mb-8 italic text-lg line-clamp-4">
          &quot;{item.feedback.comment}&quot;
        </p>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-slate-50 mt-auto">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
          {item.userId?.name?.[0] || 'S'}
        </div>
        <div>
          <h4 className="text-slate-900 font-bold text-sm">
            {item.userId ? (item.userId.name.split(' ')[0] + ' ' + (item.userId.name.split(' ')[1]?.[0] || '') + '.') : 'Student'}
          </h4>
          <p className="text-indigo-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <User className="w-3 h-3" /> Verified Student
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const PaginationButton = ({ onClick, disabled, icon, label }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
      disabled 
      ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
      : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 shadow-sm'
    }`}
  >
    {label === 'Prev' && icon}
    {label}
    {label === 'Next' && icon}
  </button>
);

export default FeedbackPage;
