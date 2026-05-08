import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './shared/components/Navbar';
import Footer from './shared/components/Footer';
import ProtectedRoute from './shared/components/ProtectedRoute';
import PageLayout from './shared/components/PageLayout';
import AdminLayout from './shared/components/AdminLayout';
import StudentLayout from './shared/components/StudentLayout';
import AIChatbot from './shared/components/AIChatbot';
import './App.css';

// Auth Pages
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';

// Public Pages
import Home from './features/home/pages/Home';
import FeedbackPage from './features/home/pages/FeedbackPage';
import FeaturesPage from './features/home/pages/FeaturesPage';
import SecurityPage from './features/home/pages/SecurityPage';
import HelpCenterPage from './features/home/pages/HelpCenterPage';
import PrivacyPolicyPage from './features/home/pages/PrivacyPolicyPage';
import ContactPage from './features/home/pages/ContactPage';

// Student Pages
import Dashboard from './features/complaints/pages/Dashboard';
import NewComplaint from './features/complaints/pages/NewComplaint';
import MyImpact from './features/complaints/pages/MyImpact';
import StudentChat from './features/complaints/pages/StudentChat';

// Admin Pages
import AdminDashboard from './features/admin/pages/AdminDashboard';
import ManageComplaints from './features/admin/pages/ManageComplaints';
import Inbox from './features/admin/pages/Inbox';

// Smart redirect component based on user role
const RoleRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  return <Navigate to="/student/dashboard" />;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

function App() {
  // Application entry point
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Routes>
          {/* ====== Public Routes (with Navbar) ====== */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-grow"><Home /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/feedback"
            element={
              <>
                <Navbar />
                <main className="flex-grow"><FeedbackPage /></main>
                <Footer />
              </>
            }
          />

          <Route
            path="/features"
            element={
              <>
                <Navbar />
                <main className="flex-grow"><FeaturesPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/security"
            element={
              <>
                <Navbar />
                <main className="flex-grow"><SecurityPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/help"
            element={
              <>
                <Navbar />
                <main className="flex-grow"><HelpCenterPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/privacy"
            element={
              <>
                <Navbar />
                <main className="flex-grow"><PrivacyPolicyPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <main className="flex-grow"><ContactPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <main className="flex-grow"><PageLayout><Login /></PageLayout></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <main className="flex-grow"><PageLayout><Register /></PageLayout></main>
                <Footer />
              </>
            }
          />

          {/* ====== Student Routes (with Sidebar) ====== */}
          <Route
            path="/student"
            element={
              <ProtectedRoute studentOnly={true}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard view="dashboard" />} />
            <Route path="complaints" element={<Dashboard view="all" />} />
            <Route path="active" element={<Dashboard view="active" />} />
            <Route path="resolved" element={<Dashboard view="resolved" />} />
            <Route path="new-complaint" element={<NewComplaint />} />
            <Route path="my-impact" element={<MyImpact />} />
            <Route path="chat" element={<StudentChat />} />
          </Route>

          {/* ====== Admin Routes (with Sidebar) ====== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard view="overview" />} />
            <Route path="analytics" element={<AdminDashboard view="analytics" />} />
            <Route path="complaints" element={<ManageComplaints />} />
            <Route path="pending" element={<ManageComplaints routeStatus="Pending" />} />
            <Route path="in-progress" element={<ManageComplaints routeStatus="In Progress" />} />
            <Route path="resolved" element={<ManageComplaints routeStatus="Resolved" />} />
            <Route path="inbox" element={<Inbox />} />
          </Route>

          {/* ====== Legacy route redirects ====== */}
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* ====== Catch-all ====== */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <AIChatbot />
      </div>
    </Router>
  );
}

export default App;
