import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getComplaints } from '../complaintSlice';
import { motion } from 'framer-motion';
import { MessageCircle, Search, ChevronRight } from 'lucide-react';
import ComplaintDetailModal from '../components/ComplaintDetailModal';

const StudentChat = () => {
  const dispatch = useDispatch();
  const { complaints, isLoading } = useSelector((state) => state.complaint);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getComplaints());
  }, [dispatch]);

  const filteredInboxes = complaints.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasUnreadMessages = (complaint) => {
    if (!complaint.messages || complaint.messages.length === 0) return false;
    return complaint.messages.some((message) => message.senderRole === 'admin' && !message.isRead);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'In Progress': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Communication Desk</h1>
        <p className="text-slate-500 mt-1">Chat directly with campus administrators about your reports</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by topic or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* Inbox List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-20 text-center space-y-4">
               <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent mx-auto" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading chats...</p>
            </div>
          ) : filteredInboxes.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {filteredInboxes.map((complaint) => (
                <motion.button
                  key={complaint._id}
                  onClick={() => {
                    setSelectedComplaint(complaint);
                    setIsDetailModalOpen(true);
                  }}
                  whileHover={{ backgroundColor: 'rgba(248, 250, 252, 1)' }}
                  className="w-full p-6 flex items-start gap-6 text-left transition-colors group relative"
                >
                  {hasUnreadMessages(complaint) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  )}

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative ${
                    complaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <MessageCircle className="w-6 h-6" />
                    
                    {hasUnreadMessages(complaint) && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold truncate pr-4 ${
                        hasUnreadMessages(complaint)
                          ? 'text-emerald-900 text-lg' 
                          : 'text-slate-900'
                      }`}>
                        {complaint.title}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        {new Date(complaint.updatedAt || complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${getStatusColor(complaint.status)}`}>
                         {complaint.status}
                       </span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         {complaint.category}
                       </span>
                    </div>

                    <p className={`text-sm line-clamp-1 ${
                      hasUnreadMessages(complaint)
                        ? 'text-emerald-600 font-bold' 
                        : 'text-slate-500 italic'
                    }`}>
                      {complaint.messages && complaint.messages.length > 0 
                        ? complaint.messages[complaint.messages.length - 1].text 
                        : "No messages yet. Our team will update you here."}
                    </p>
                  </div>

                  <div className="self-center">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center space-y-4">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                  <MessageCircle className="w-8 h-8 text-slate-200" />
               </div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No active conversations yet</p>
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

export default StudentChat;
