import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllComplaintsAdmin } from '../../complaints/complaintSlice';
import { markAllReadByComplaint } from '../../notifications/notificationSlice';
import { motion } from 'framer-motion';
import { Mail, Search, ChevronRight, MessageCircle, Filter } from 'lucide-react';
import ComplaintDetailModal from '../../complaints/components/ComplaintDetailModal';

const Inbox = () => {
  const dispatch = useDispatch();
  const { adminComplaints = [], isLoading } = useSelector((state) => state.complaint);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllComplaintsAdmin());
  }, [dispatch]);

  // Filter complaints that have messages
  const messagedComplaints = adminComplaints.filter(c => 
    (c.messages && c.messages.length > 0) || c.status === 'Pending' // Show all for now, or filter by message
  );

  const hasUnreadMessages = (complaint) => {
    if (!complaint.messages || complaint.messages.length === 0) return false;
    return complaint.messages.some((message) => message.senderRole === 'student' && !message.isRead);
  };

  const filteredInboxes = messagedComplaints.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const handleOpenComplaint = (complaint) => {
    if (hasUnreadMessages(complaint)) {
      dispatch(markAllReadByComplaint(complaint._id));
    }
    setSelectedComplaint(complaint);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Inbox</h1>
          <p className="text-slate-500 mt-1">Manage all active conversations and student inquiries</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by student name or complaint title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 text-sm transition-all"
            />
          </div>
          <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Inbox List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-20 text-center space-y-4">
               <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent mx-auto" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing conversations...</p>
            </div>
          ) : filteredInboxes.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {filteredInboxes.map((complaint) => (
                <motion.button
                  key={complaint._id}
                  onClick={() => handleOpenComplaint(complaint)}
                  whileHover={{ backgroundColor: 'rgba(248, 250, 252, 1)' }}
                  className="w-full p-6 flex items-start gap-6 text-left transition-colors relative group"
                >
                  {hasUnreadMessages(complaint) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                  )}

                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:scale-110 transition-transform relative">
                    <MessageCircle className="w-6 h-6" />
                    {hasUnreadMessages(complaint) && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold truncate pr-4 ${
                        hasUnreadMessages(complaint)
                          ? 'text-indigo-900 text-lg' 
                          : 'text-slate-900'
                      }`}>
                        {complaint.title}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        {new Date(complaint.updatedAt || complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${getPriorityColor(complaint.priority)}`}>
                         {complaint.priority}
                       </span>
                       <span className="text-[10px] font-bold text-slate-400 truncate">
                         From: <span className="text-slate-600">{complaint.userId?.name || 'Unknown Student'}</span>
                       </span>
                    </div>

                    <p className={`text-sm line-clamp-1 ${
                      hasUnreadMessages(complaint)
                        ? 'text-indigo-600 font-bold' 
                        : 'text-slate-500 italic'
                    }`}>
                      {complaint.messages && complaint.messages.length > 0 
                        ? complaint.messages[complaint.messages.length - 1].text 
                        : "No messages yet. Click to start a conversation."}
                    </p>
                  </div>

                  <div className="self-center">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center space-y-4">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                  <Mail className="w-8 h-8 text-slate-200" />
               </div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No messages found</p>
            </div>
          )}
        </div>
      </div>

      <ComplaintDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        complaint={selectedComplaint}
      />
    </div>
  );
};

export default Inbox;
