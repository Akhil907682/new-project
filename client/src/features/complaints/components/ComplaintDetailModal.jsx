import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, User, ShieldCheck, Clock, 
  AlertCircle, CheckCircle2, Image as ImageIcon,
  MessageSquare, Calendar, Star, Sparkles, Loader2
} from 'lucide-react';
import { sendMessage } from '../complaintSlice';
import { markAllReadByComplaint } from '../../notifications/notificationSlice';
import { getReplySuggestions, clearReplySuggestions } from '../../ai/aiSlice';
import FeedbackModal from './FeedbackModal';

const ComplaintDetailModal = ({ isOpen, onClose, complaint: initialComplaint }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { complaints, adminComplaints } = useSelector((state) => state.complaint);
  const { notifications = [] } = useSelector((state) => state.notification || {});
  
  // Find the freshest version of this complaint from the store
  const complaint = [...(complaints || []), ...(adminComplaints || [])].find(
    (c) => (c._id === initialComplaint?._id || c.id === initialComplaint?._id || c._id === initialComplaint?.id || c.id === initialComplaint?.id)
  ) || initialComplaint;

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const chatEndRef = useRef(null);

  const { replySuggestions, isLoading: aiLoading } = useSelector((state) => state.ai);

  // Fetch AI replies if admin
  useEffect(() => {
    if (isOpen && user?.role === 'admin' && complaint?._id) {
      dispatch(getReplySuggestions(complaint._id));
    }
    return () => {
      dispatch(clearReplySuggestions());
    };
  }, [isOpen, user?.role, complaint?._id, dispatch]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      
      // Only mark as read if there are unread messages from the other party
      const otherRole = user?.role === 'admin' ? 'student' : 'admin';
      const hasUnread = complaint?.messages?.some(m => m.senderRole === otherRole && !m.isRead);
      const hasUnreadNotification = notifications.some((notification) => {
        const notificationComplaintId = notification.complaintId?._id || notification.complaintId;
        return String(notificationComplaintId) === String(complaint?._id) && !notification.isRead;
      });
      
      if (complaint?._id && (hasUnread || hasUnreadNotification)) {
        dispatch(markAllReadByComplaint(complaint._id));
      }
    }
  }, [isOpen, complaint?.messages, complaint?._id, dispatch, user?.role, notifications]);

  if (!complaint) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || isSending) {
      return;
    }

    const nextMessage = messageText.trim();
    setSendError('');
    setIsSending(true);
    try {
      await dispatch(sendMessage({ complaintId: complaint._id, text: nextMessage })).unwrap();
      setMessageText('');
    } catch (err) {
      setSendError(err?.message || err || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-amber-500" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl h-[90vh] md:h-[80vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left Column: Complaint Details */}
              <div className="w-full md:w-[40%] bg-slate-50 border-r border-slate-100 p-8 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-6 lg:hidden">
                   <h3 className="font-black text-slate-900 uppercase tracking-tighter text-2xl">Details</h3>
                   <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm">
                     <X className="w-5 h-5" />
                   </button>
                </div>

                {/* Image Preview */}
                {complaint.image ? (
                  <div className="relative group mb-6">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-xl">
                      <img 
                        src={`http://localhost:5000${complaint.image}`} 
                        alt="Evidence" 
                        className="w-full h-full object-cover"
                      />
                      <a 
                        href={`http://localhost:5000${complaint.image}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-zoom-in"
                      >
                        <ImageIcon className="text-white w-8 h-8" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 mb-6 border-2 border-dashed border-slate-300">
                     <ImageIcon className="w-10 h-10 mb-2" />
                     <p className="text-xs font-bold uppercase tracking-widest">No Evidence Provided</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 shadow-sm">
                       {getStatusIcon(complaint.status)}
                       {complaint.status}
                     </span>
                     <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2 tracking-tight">{complaint.title}</h2>
                     <p className="text-slate-600 text-sm leading-relaxed">{complaint.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                      <p className="text-sm font-bold text-slate-800">{complaint.category}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                      <p className={`text-sm font-bold ${
                        complaint.priority === 'High' ? 'text-red-600' : 
                        complaint.priority === 'Medium' ? 'text-amber-600' : 'text-blue-600'
                      }`}>{complaint.priority}</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted By</p>
                          <p className="text-xs font-bold text-slate-800">
                            {complaint.userId?.name || (complaint.userId === user?._id || complaint.userId?._id === user?._id ? user?.name : 'Participant')}
                          </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Reported</p>
                          <p className="text-xs font-bold text-slate-800">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>

                  {/* Feedback Section */}
                  {complaint.status === 'Resolved' && (
                    <div className="pt-4 border-t border-slate-200">
                      {complaint.feedback && complaint.feedback.rating ? (
                        /* Display Existing Feedback */
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Feedback</p>
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= complaint.feedback.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-xs font-bold text-slate-500">
                              {complaint.feedback.rating}/5
                            </span>
                          </div>
                          {complaint.feedback.comment && (
                            <p className="text-sm text-slate-600 leading-relaxed italic mt-2">
                              &quot;{complaint.feedback.comment}&quot;
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400 mt-2 font-medium">
                            {new Date(complaint.feedback.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        /* Prompt to Give Feedback (only for complaint owner) */
                        user && (complaint.userId?._id === user._id || complaint.userId === user._id) && (
                          <motion.button
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsFeedbackOpen(true)}
                            className="w-full py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-emerald-200"
                          >
                            <Star className="w-4 h-4" />
                            Share Your Experience
                          </motion.button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Chat Section */}
              <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 z-20 hidden lg:block">
                   <button 
                    onClick={onClose} 
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                  >
                     <X className="w-6 h-6" />
                   </button>
                </div>

                {/* Chat Header */}
                <div className="px-8 pt-8 pb-4 border-b border-slate-50">
                   <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl flex items-center gap-2">
                     <MessageSquare className="w-6 h-6 text-indigo-500" />
                     Communication Timeline
                   </h3>
                   <p className="text-slate-400 text-xs font-medium mt-1">Direct message channel for this specific case</p>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/50">
                  {complaint.messages && complaint.messages.length > 0 ? (
                    complaint.messages.map((msg, idx) => {
                      const senderId = msg.senderId?._id || msg.senderId;
                      const isMine = String(senderId) === String(user?._id);

                      return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg._id || `${msg.createdAt || 'message'}-${idx}`}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-2 mb-1.5 px-1">
                          {msg.senderRole === 'admin' && <ShieldCheck className="w-3 h-3 text-indigo-600" />}
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm text-sm ${
                          isMine
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </motion.div>
                    )})
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50">
                       <div className="p-6 bg-white rounded-full shadow-sm border border-slate-100">
                          <MessageSquare className="w-12 h-12" />
                       </div>
                       <p className="text-sm font-bold uppercase tracking-[0.2em]">No messages yet</p>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Message Input Area */}
                <div className="bg-white border-t border-slate-100 flex flex-col">
                   {/* Smart Replies for Admins */}
                   {user?.role === 'admin' && (
                     <div className="px-8 pt-4 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
                       {aiLoading ? (
                         <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium px-3 py-1.5 bg-indigo-50 rounded-full">
                           <Loader2 className="w-3 h-3 animate-spin" /> Generating Smart Replies...
                         </div>
                       ) : replySuggestions?.length > 0 ? (
                         <>
                           <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-tighter shrink-0 border border-indigo-100">
                             <Sparkles className="w-3 h-3" /> Smart Reply
                           </div>
                           {replySuggestions.map((suggestion, idx) => (
                             <button
                               key={idx}
                               onClick={() => setMessageText(suggestion)}
                               className="text-xs text-slate-600 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 px-4 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 shadow-sm"
                             >
                               {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
                             </button>
                           ))}
                         </>
                       ) : null}
                     </div>
                   )}

                   <form onSubmit={handleSendMessage} className="p-8 pt-4">
                   <div className="relative flex items-center">
                      <input 
                        type="text" 
                        placeholder="Type your update here..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm transition-all"
                      />
                      <button 
                        type="submit"
                        disabled={!messageText.trim() || isSending}
                        className={`absolute right-2 p-3 text-white rounded-full transition-all active:scale-95 shadow-lg ${
                          isSending ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                        }`}
                      >
                        {isSending ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                   </div>
                   {sendError && (
                     <p className="text-xs text-red-600 mt-3 font-semibold">
                       {sendError}
                     </p>
                   )}
                   <p className="text-[10px] text-center text-slate-400 mt-4 font-black uppercase tracking-widest">
                     Only participants can view this conversation
                   </p>
                </form>
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        complaintId={complaint?._id}
      />
    </>
  );
};

export default ComplaintDetailModal;
