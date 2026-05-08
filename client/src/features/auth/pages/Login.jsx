import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, googleLogin, reset } from '../authSlice';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const googleBtnRef = useRef(null);

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  }, [user, isSuccess, navigate]);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Google Sign-In callback
  const handleGoogleResponse = useCallback(
    (response) => {
      if (response.credential) {
        dispatch(googleLogin(response.credential));
      }
    },
    [dispatch]
  );

  // Initialize Google Sign-In and render hidden button
  useEffect(() => {
    const initGoogle = () => {
      if (window.google && GOOGLE_CLIENT_ID && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: 400,
        });
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [handleGoogleResponse]);

  const handleGoogleClick = () => {
    const googleBtn = googleBtnRef.current?.querySelector('div[role="button"]');
    if (googleBtn) {
      googleBtn.click();
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-100 p-3 rounded-full mb-4 text-indigo-600">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2 text-center">Enter your credentials to access your account</p>
        </div>

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <span className="font-semibold italic">Oops!</span> {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                placeholder="name@university.edu"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Hidden Google rendered button */}
        <div ref={googleBtnRef} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, overflow: 'hidden' }}></div>

        {/* Custom Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all shadow-sm"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
