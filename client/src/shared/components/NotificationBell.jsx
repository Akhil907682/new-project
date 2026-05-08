import { useState, useEffect, useRef } from 'react';
import { Bell, MessageCircle, AlertCircle, X, ChevronRight, RefreshCw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications, markAsRead } from '../../features/notifications/notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { notifications = [], isLoading } = useSelector((state) => state.notification || {});
  const { user } = useSelector((state) => state.auth || {});
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredNotifications = (notifications || []).filter((n) => {
    if (user?.role === 'admin') {
      return n.type === 'new_complaint' || n.type === 'new_message';
    }
    return n.type === 'status_update' || n.type === 'new_message';
  });
  const unreadCount = (filteredNotifications || []).filter((n) => !n.isRead).length;

  useEffect(() => {
    if (user) {
      dispatch(getNotifications());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }
    
    // Redirection Logic
    if (user?.role === 'admin') {
      if (notification.type === 'new_message') {
        navigate('/admin/inbox');
      } else if (notification.type === 'new_complaint') {
        navigate('/admin/complaints');
      }
    } else {
      if (notification.type === 'new_message') {
        navigate('/student/chat');
      } else if (notification.type === 'status_update') {
        navigate('/student/dashboard');
      }
    }
    
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group"
      >
        <Bell className={`w-5 h-5 ${isOpen ? 'text-indigo-600' : 'group-hover:rotate-12'} transition-all`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] overflow-hidden origin-top-right"
          >
            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Notifications</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => dispatch(getNotifications())}
                  className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-indigo-600"
                  title="Refresh Notifications"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                {unreadCount > 0 && (
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full p-4 flex gap-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 relative ${
                      !n.isRead ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      n.type === 'status_update' ? 'bg-amber-100 text-amber-600' : 
                      n.type === 'new_complaint' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-indigo-100 text-indigo-600'
                    }`}>
                      {n.type === 'status_update' ? <AlertCircle className="w-4 h-4" /> : 
                       n.type === 'new_complaint' ? <RefreshCw className="w-4 h-4" /> :
                       <MessageCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className={`text-xs leading-relaxed ${!n.isRead ? 'font-bold text-slate-900' : 'text-slate-600 font-medium'}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.isRead && (
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0 shadow-sm" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <Bell className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No notifications yet</p>
                </div>
              )}
            </div>

            {filteredNotifications.length > 0 && (
              <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  End of updates
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
