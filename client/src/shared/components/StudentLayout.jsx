import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import {
  LayoutDashboard,
  ListChecks,
  FilePlus,
  LogOut,
  ShieldAlert,
  ChevronRight,
  MessageSquare,
  Heart,
  MessageCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import NotificationBell from './NotificationBell';

const studentNavItems = [
  {
    to: '/student/dashboard',
    icon: LayoutDashboard,
    label: 'My Dashboard',
  },
  {
    to: '/student/complaints',
    icon: ListChecks,
    label: 'All Complaints',
  },
  {
    to: '/student/active',
    icon: Clock,
    label: 'Active Complaints',
  },
  {
    to: '/student/resolved',
    icon: CheckCircle2,
    label: 'Resolved',
  },
  {
    to: '/student/new-complaint',
    icon: FilePlus,
    label: 'File a Complaint',
  },
  {
    to: '/student/my-impact',
    icon: Heart,
    label: 'My Impact',
  },
  {
    to: '/student/chat',
    icon: MessageCircle,
    label: 'Chat',
  },
];

const StudentLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications = [] } = useSelector((state) => state.notification || {});

  const unreadMessagesCount = notifications?.filter(n => 
    n.type === 'new_message' && !n.isRead
  ).length || 0;

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <div className="admin-layout student-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar student-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon student-logo-icon">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="sidebar-brand">
                Campus<span>Guard</span>
              </h1>
              <p className="sidebar-role">Student Portal</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-nav-label">Navigation</p>
          {studentNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/student/dashboard'}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <div className="relative">
                <item.icon className="w-[18px] h-[18px]" />
                {item.label === 'Chat' && unreadMessagesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white shadow-sm"></span>
                  </span>
                )}
              </div>
              <span>{item.label}</span>
              <ChevronRight className="sidebar-nav-arrow w-4 h-4" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            onClick={() => window.dispatchEvent(new Event('openAIChatbot'))}
            className="sidebar-ai-card student-ai-card group hover:bg-emerald-600 hover:text-white transition-all cursor-pointer w-full text-left"
          >
            <MessageSquare className="w-4 h-4 text-emerald-300 group-hover:text-white transition-colors" />
            <span>AI-Powered Support</span>
          </button>

          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar student-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user?.name}</p>
              <p className="sidebar-user-email">{user?.email}</p>
            </div>
          </div>

          <button onClick={onLogout} className="sidebar-logout-btn">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="flex justify-end p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-40 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <div className="h-4 w-px bg-slate-200 hidden md:block" />
            <NotificationBell />
          </div>
        </header>
        <div className="px-8 pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
