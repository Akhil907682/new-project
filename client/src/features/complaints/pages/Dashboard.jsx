import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getComplaints, resetStatus } from '../complaintSlice';
import { MessageSquare, Clock, CheckCircle2, AlertCircle, Image as ImageIcon, Star, RefreshCw } from 'lucide-react';
import ComplaintModal from '../components/ComplaintModal';
import ComplaintDetailModal from '../components/ComplaintDetailModal';
import FeedbackModal from '../components/FeedbackModal';
import { useLocation } from 'react-router-dom';

const Dashboard = ({ view = 'dashboard' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { complaints, isLoading, isError, message } = useSelector(
    (state) => state.complaint
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackComplaintId, setFeedbackComplaintId] = useState(null);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let timeout;
    if (isLoading && complaints.length === 0) {
      timeout = setTimeout(() => {
        setIsTimedOut(true);
      }, 5000); // 5 second safety timeout
    }
    return () => clearTimeout(timeout);
  }, [isLoading, complaints.length]);

  useEffect(() => {
    // Check for openModal query param
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('openModal') === 'true') {
      setIsModalOpen(true);
    }
  }, [location]);

  useEffect(() => {
    dispatch(getComplaints());

    return () => {
      dispatch(resetStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (!user) {
      navigate('/login');
    }
  }, [user, navigate, isError, message]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 font-bold';
      case 'Medium':
        return 'text-amber-600 font-bold';
      default:
        return 'text-blue-600 font-bold';
    }
  };

  const hasUnreadAdminMessages = (complaint) =>
    complaint.messages?.some((message) => message.senderRole === 'admin' && !message.isRead);

  const viewConfig = {
    dashboard: {
      title: 'My Dashboard',
      subtitle: 'Track and manage your submitted campus issues',
      tableTitle: 'Recent Submissions',
      complaints: complaints.slice(0, 5),
      empty: 'No recent complaints found',
      showStats: true,
    },
    all: {
      title: 'All Complaints',
      subtitle: 'Review every campus issue you have submitted',
      tableTitle: `All Complaints (${complaints.length})`,
      complaints,
      empty: 'No complaints found',
      showStats: false,
    },
    active: {
      title: 'Active Complaints',
      subtitle: 'Track pending and in-progress campus issues',
      tableTitle: `Active Complaints (${complaints.filter(c => c.status !== 'Resolved').length})`,
      complaints: complaints.filter(c => c.status !== 'Resolved'),
      empty: 'No active complaints found',
      showStats: false,
    },
    resolved: {
      title: 'Resolved Complaints',
      subtitle: 'Review completed issues and submit feedback where available',
      tableTitle: `Resolved Complaints (${complaints.filter(c => c.status === 'Resolved').length})`,
      complaints: complaints.filter(c => c.status === 'Resolved'),
      empty: 'No resolved complaints found',
      showStats: false,
    },
  };

  const currentView = viewConfig[view] || viewConfig.dashboard;

  if (isLoading && complaints.length === 0 && !isTimedOut) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-50 border-t-indigo-600 shadow-xl shadow-indigo-100"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-indigo-200 animate-pulse" />
          </div>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{currentView.title}</h1>
          <p className="text-slate-500 mt-1">{currentView.subtitle}</p>
        </div>
      </div>

      {currentView.showStats && <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
             <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Tickets</p>
            <p className="text-2xl font-bold text-slate-900">{complaints.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
             <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Pending/Active</p>
            <p className="text-2xl font-bold text-slate-900">
              {complaints.filter(c => c.status !== 'Resolved').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-xl text-green-600">
             <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Resolved</p>
            <p className="text-2xl font-bold text-slate-900">
              {complaints.filter(c => c.status === 'Resolved').length}
            </p>
          </div>
        </div>
      </div>}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-lg">{currentView.tableTitle}</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Complaint</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Priority</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Evidence</th>
                <th className="px-6 py-4 text-center">Feedback</th>
                <th className="px-6 py-4 text-center">Chat</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentView.complaints.length > 0 ? (
                currentView.complaints.map((complaint) => (
                  <tr 
                    key={complaint._id} 
                    className="hover:bg-indigo-50/30 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 line-clamp-1">{complaint.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{complaint.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-500">{complaint.category}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`text-[10px] uppercase font-black tracking-tighter py-1 inline-flex items-center gap-1 ${getPriorityColor(complaint.priority)}`}>
                         <AlertCircle className="w-3 h-3" />
                         {complaint.priority}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${getStatusColor(complaint.status)}`}>
                         {complaint.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {complaint.image ? (
                           <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 group-hover:border-indigo-400 transition-colors">
                            <img 
                              src={`http://localhost:5000${complaint.image}`} 
                              alt="Evidence" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-200" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {complaint.status === 'Resolved' ? (
                        complaint.feedback && complaint.feedback.rating ? (
                          <div className="flex items-center justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= complaint.feedback.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200'
                                  }`}
                              />
                            ))}
                          </div>
                        ) : (
                          user && (complaint.userId?._id === user._id || complaint.userId === user._id) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFeedbackComplaintId(complaint._id);
                                setIsFeedbackModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-all border border-emerald-200 shadow-sm"
                            >
                              <Star className="w-3 h-3" />
                              Rate
                            </button>
                          )
                        )
                      ) : (
                        <span className="text-slate-200 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setSelectedComplaint(complaint);
                           setIsDetailModalOpen(true);
                         }}
                         className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all relative group/chat mx-auto block shadow-sm border border-indigo-100"
                      >
                         <MessageSquare className="w-4 h-4 group-hover/chat:scale-110 transition-transform" />
                         {hasUnreadAdminMessages(complaint) && (
                           <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                         )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[11px] font-bold text-slate-400">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="w-12 h-12 text-slate-100" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{currentView.empty}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ComplaintDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        complaint={selectedComplaint}
      />

      <ComplaintModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setFeedbackComplaintId(null);
        }}
        complaintId={feedbackComplaintId}
      />
    </div>
  );
};

export default Dashboard;
