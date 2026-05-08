import { useEffect, cloneElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllComplaintsAdmin, getStats } from '../../complaints/complaintSlice';
import { getDashboardSummary } from '../../ai/aiSlice';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Users, CheckCircle, Clock, AlertTriangle, Star, Sparkles,
  Loader2, RefreshCw, TrendingUp, ArrowRight,
} from 'lucide-react';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const AdminDashboard = ({ view = 'overview' }) => {
  const dispatch = useDispatch();
  const { stats, isLoading, adminComplaints = [] } = useSelector((state) => state.complaint);
  const { summary: aiSummary, isLoading: aiLoading } = useSelector((state) => state.ai);
  const isAnalyticsView = view === 'analytics';

  useEffect(() => {
    dispatch(getAllComplaintsAdmin());
    dispatch(getStats());
    dispatch(getDashboardSummary());
  }, [dispatch]);

  if (isLoading && !stats) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const recentComplaints = adminComplaints.slice(0, 5);

  const refreshData = () => {
    dispatch(getAllComplaintsAdmin());
    dispatch(getStats());
    dispatch(getDashboardSummary());
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isAnalyticsView ? 'Analytics' : 'Admin Command Center'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isAnalyticsView
              ? 'Review AI insights and complaint distribution trends'
              : 'Global oversight and resolution management'}
          </p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center gap-2 text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {isAnalyticsView ? (
        <>
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-500/30 p-2 rounded-xl border border-indigo-400/30">
                  <Sparkles className="w-6 h-6 text-indigo-300" />
                </div>
                <h2 className="text-xl font-bold">AI Executive Summary</h2>
              </div>
              {aiLoading ? (
                <div className="flex items-center gap-3 text-indigo-200">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p>Analyzing recent campus data...</p>
                </div>
              ) : (
                <p className="text-indigo-100 leading-relaxed max-w-4xl text-lg font-medium">
                  {aiSummary || 'No insights available at the moment.'}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-800 mb-6 text-lg">Category Distribution</h2>
              <div className="h-[300px]">
                {stats?.categoryStats && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.categoryStats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-800 mb-6 text-lg">Priority Overview</h2>
              <div className="h-[300px]">
                {stats?.priorityStats && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.priorityStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="_id"
                      >
                        {stats.priorityStats.map((entry, index) => (
                          <Cell key={`cell-${entry._id || index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <StatCard title="Total Complaints" value={stats?.totalComplaints} icon={<Users />} color="indigo" />
            <StatCard title="Pending" value={stats?.pendingComplaints} icon={<AlertTriangle />} color="amber" />
            <StatCard title="In Progress" value={stats?.inProgressComplaints} icon={<Clock />} color="blue" />
            <StatCard title="Resolved" value={stats?.resolvedComplaints} icon={<CheckCircle />} color="green" />
            <StatCard
              title="Avg. Satisfaction"
              value={stats?.averageRating ? `${stats.averageRating} stars` : '-'}
              icon={<Star />}
              color="purple"
              subtitle={stats?.feedbackCount ? `${stats.feedbackCount} reviews` : ''}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-lg">Recent Complaints</h2>
                  <p className="text-xs text-slate-400">Latest 5 submissions</p>
                </div>
              </div>
              <Link
                to="/admin/complaints"
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm font-bold transition-colors group"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentComplaints.map((complaint) => (
                <div key={complaint._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      complaint.status === 'Resolved' ? 'bg-emerald-500' :
                      complaint.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-300'
                    }`} />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{complaint.title}</p>
                      <p className="text-xs text-slate-400">{complaint.userId?.name} - {new Date(complaint.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      complaint.priority === 'High' ? 'bg-red-50 text-red-600' :
                      complaint.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {complaint.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      complaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' :
                      complaint.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
              ))}
              {recentComplaints.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-slate-400 text-sm">No complaints yet</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, subtitle }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`${colors[color]} p-3 rounded-xl ring-4 ring-white shadow-sm`}>
        {cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value || 0}</p>
        {subtitle && <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
