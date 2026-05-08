import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import { LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    return user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group focus:outline-none">
              <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-100">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <span className="text-slate-900 font-black text-2xl tracking-tight">Campus<span className="text-indigo-600">Guard</span></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-sm font-medium text-slate-700 mr-4">
                  Welcome, <span className="text-indigo-600 font-semibold">{user.name}</span>
                </div>
                
                <NotificationBell />
                
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 text-slate-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-transparent hover:border-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-all focus:outline-none">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
