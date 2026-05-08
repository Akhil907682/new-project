import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllComplaintsAdmin, updateStatus, deleteComplaint } from '../../complaints/complaintSlice';
import { markAsRead } from '../../notifications/notificationSlice';
import { Users, Search, Filter, X, MessageCircle, Star, RefreshCw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ComplaintDetailModal from '../../complaints/components/ComplaintDetailModal';
import SuccessOverlay from '../../../shared/components/SuccessOverlay';
import DeleteConfirmationModal from '../../../shared/components/DeleteConfirmationModal';

const ManageComplaints = ({ routeStatus = 'All' }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const { adminComplaints = [], isLoading } = useSelector(
    (state) => state.complaint
  );
  const { notifications = [] } = useSelector((state) => state.notification || {});

  // Advanced Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successConfig, setSuccessConfig] = useState({ message: '', subMessage: '', type: 'success' });
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const effectiveStatusFilter = routeStatus === 'All' ? statusFilter : routeStatus;

  useEffect(() => {
    let timeout;
    if (isLoading && adminComplaints.length === 0) {
      timeout = setTimeout(() => {
        setIsTimedOut(true);
      }, 5000); // 5 second safety timeout
    }
    return () => clearTimeout(timeout);
  }, [isLoading, adminComplaints.length]);

  useEffect(() => {
    dispatch(getAllComplaintsAdmin());
  }, [dispatch]);

  useEffect(() => {
    notifications
      .filter((notification) => notification.type === 'new_complaint' && !notification.isRead)
      .forEach((notification) => dispatch(markAsRead(notification._id)));
  }, [dispatch, notifications]);

  const handleStatusUpdate = (id, newStatus) => {
    dispatch(updateStatus({ id, status: newStatus }));
    if (newStatus === 'Resolved') {
      setSuccessConfig({
        message: 'Issue Resolved!',
        subMessage: 'The complaint has been successfully marked as resolved. The student will be notified.',
        type: 'success'
      });
      setShowSuccess(true);
    }
  };

  const handleDeleteClick = (complaint) => {
    setComplaintToDelete(complaint);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (complaintToDelete) {
      dispatch(deleteComplaint(complaintToDelete._id));
      setSuccessConfig({
        message: 'Complaint Deleted',
        subMessage: 'The record has been permanently removed from the system.',
        type: 'danger'
      });
      setShowSuccess(true);
      setComplaintToDelete(null);
    }
  };

  const filteredComplaints = adminComplaints.filter((c) => {
    const searchMatch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = effectiveStatusFilter === 'All' || c.status === effectiveStatusFilter;
    const priorityMatch = priorityFilter === 'All' || c.priority === priorityFilter;
    const ratingMatch =
      ratingFilter === 'All' ||
      (ratingFilter === 'Unrated' ? !c.feedback?.rating : c.feedback?.rating === parseInt(ratingFilter));

    return searchMatch && statusMatch && priorityMatch && ratingMatch;
  });

  const activeFiltersCount = (routeStatus === 'All' && statusFilter !== 'All' ? 1 : 0) + (priorityFilter !== 'All' ? 1 : 0) + (ratingFilter !== 'All' ? 1 : 0);

  const clearFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
    setRatingFilter('All');
    setSearchTerm('');
  };

  const pageTitle = routeStatus === 'All' ? 'All Complaints' : `${routeStatus} Complaints`;
  const pageSubtitle = routeStatus === 'All'
    ? 'Triage, update, and resolve campus issues'
    : `Review and manage complaints currently marked ${routeStatus.toLowerCase()}`;

  if (isLoading && adminComplaints.length === 0 && !isTimedOut) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-50 border-t-indigo-600 shadow-xl shadow-indigo-100"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-indigo-200 animate-pulse" />
          </div>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Fetching records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
          <p className="text-slate-500 mt-1">{pageSubtitle}</p>
        </div>
        <button
          onClick={() => dispatch(getAllComplaintsAdmin())}
          className="flex items-center gap-2 text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Global Control Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 items-center justify-between flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-slate-900">{pageTitle} ({filteredComplaints.length})</h2>
          <p className="text-slate-500 text-xs font-medium">Use the tools below to triage and resolve issues</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            {routeStatus === 'All' && statusFilter !== 'All' && (
              <button
                onClick={() => setStatusFilter('All')}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                Status: {statusFilter}
                <X className="w-2.5 h-2.5 group-hover:rotate-90 transition-transform" />
              </button>
            )}
            {priorityFilter !== 'All' && (
              <button
                onClick={() => setPriorityFilter('All')}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              >
                Priority: {priorityFilter}
                <X className="w-2.5 h-2.5 group-hover:rotate-90 transition-transform" />
              </button>
            )}
            {ratingFilter !== 'All' && (
              <button
                onClick={() => setRatingFilter('All')}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-full text-[10px] font-black uppercase tracking-wider text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
              >
                Rating: {ratingFilter}{ratingFilter !== 'Unrated' && '★'}
                <X className="w-2.5 h-2.5 group-hover:rotate-90 transition-transform" />
              </button>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm"
              >
                Search: {searchTerm}
                <X className="w-2.5 h-2.5 group-hover:rotate-90 transition-transform" />
              </button>
            )}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors ml-2"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`relative px-5 py-3 rounded-2xl transition-all border flex items-center gap-2.5 shadow-sm group ${
                  isFilterOpen || activeFiltersCount > 0
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 ring-4 ring-indigo-500/10'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-indigo-400'
                }`}
              >
                <Filter className={`w-4 h-4 ${isFilterOpen ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Filters</span>

                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white">
                      {activeFiltersCount}
                    </span>
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsFilterOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 p-6 origin-top-left overflow-hidden"
                    >
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
                      <div className="space-y-6 relative z-10">
                        {routeStatus === 'All' && <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Status</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
                              <button
                                key={status}
                                onClick={() => {
                                  setStatusFilter(status);
                                  setIsFilterOpen(false);
                                }}
                                className={`text-xs py-2.5 px-3 rounded-xl font-bold transition-all border ${
                                  statusFilter === status
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                                    : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-indigo-200'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>}
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Priority</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['All', 'Low', 'Medium', 'High'].map((priority) => (
                              <button
                                key={priority}
                                onClick={() => {
                                  setPriorityFilter(priority);
                                  setIsFilterOpen(false);
                                }}
                                className={`text-xs py-2.5 px-3 rounded-xl font-bold transition-all border ${
                                  priorityFilter === priority
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-200'
                                    : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-indigo-200'
                                }`}
                              >
                                {priority}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Rating</p>
                          <div className="grid grid-cols-3 gap-2">
                            {['All', '5', '4', '3', '2', '1', 'Unrated'].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => {
                                  setRatingFilter(rating);
                                  setIsFilterOpen(false);
                                }}
                                className={`text-xs py-2 px-1 rounded-xl font-bold transition-all border ${
                                  ratingFilter === rating
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-100'
                                    : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-indigo-200'
                                }`}
                              >
                                {rating}{rating !== 'All' && rating !== 'Unrated' && '★'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Find a specific complaint..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Management Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Complaint & User</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4 text-center">Evidence</th>
                <th className="px-6 py-4 text-center">Feedback</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr
                    key={complaint._id}
                    className="hover:bg-indigo-50/20 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{complaint.title}</div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {complaint.userId?.name} ({complaint.userId?.email})
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <PriorityBadge priority={complaint.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {complaint.image ? (
                          <a
                            href={`http://localhost:5000${complaint.image}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 hover:scale-110 transition-transform cursor-zoom-in relative"
                          >
                            <img
                              src={`http://localhost:5000${complaint.image}`}
                              alt="Evidence"
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ) : (
                          <span className="text-slate-300 italic text-[10px] uppercase font-bold tracking-widest">No File</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {complaint.feedback && complaint.feedback.rating ? (
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
                          {complaint.feedback.comment && (
                            <span className="ml-1 text-[10px] text-slate-400" title={complaint.feedback.comment}>💬</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-200 text-xs italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {complaint.status !== 'In Progress' && complaint.status !== 'Resolved' && (
                          <ActionButton
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(complaint._id, 'In Progress'); }}
                            label="Start"
                            color="amber"
                          />
                        )}
                        {complaint.status !== 'Resolved' && (
                          <ActionButton
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(complaint._id, 'Resolved'); }}
                            label="Resolve"
                            color="green"
                          />
                        )}
                         <button
                           onClick={(e) => { e.stopPropagation(); setSelectedComplaint(complaint); setIsDetailModalOpen(true); }}
                           className="p-1.5 text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                           title="Chat & Details"
                         >
                           <MessageCircle className="w-4 h-4" />
                         </button>
                         <button
                           onClick={(e) => { e.stopPropagation(); handleDeleteClick(complaint); }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Delete Complaint"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-12 h-12 text-slate-100" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No complaints match your filters</p>
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

      <SuccessOverlay
        isOpen={showSuccess}
        message={successConfig.message}
        subMessage={successConfig.subMessage}
        type={successConfig.type}
        onClose={() => setShowSuccess(false)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={complaintToDelete?.title}
      />
    </div>
  );
};

const PriorityBadge = ({ priority }) => {
  const colors = {
    High: 'text-red-700 bg-red-50 border-red-100',
    Medium: 'text-amber-700 bg-amber-50 border-amber-100',
    Low: 'text-blue-700 bg-blue-50 border-blue-100',
  };
  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${colors[priority]}`}>
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    Resolved: 'text-emerald-700 bg-emerald-50',
    'In Progress': 'text-amber-700 bg-amber-50',
    Pending: 'text-slate-700 bg-slate-50',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      ● {status}
    </span>
  );
};

const ActionButton = ({ onClick, label, color }) => {
  const colors = {
    amber: 'text-amber-600 hover:bg-amber-50 border-amber-100',
    green: 'text-emerald-600 hover:bg-emerald-50 border-emerald-100',
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${colors[color]}`}
    >
      {label}
    </button>
  );
};

export default ManageComplaints;
