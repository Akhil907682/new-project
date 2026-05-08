import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getComplaints } from '../complaintSlice';
import { motion } from 'framer-motion';
import { Heart, Award, CheckCircle, Zap, TrendingUp, Users } from 'lucide-react';

const MyImpact = () => {
  const dispatch = useDispatch();
  const { complaints, isLoading } = useSelector((state) => state.complaint);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getComplaints());
  }, [dispatch]);

  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const totalReports = complaints.length;

  // Impact Score Calculation (Arbitrary for UX)
  const impactScore = (resolvedCount * 100) + (inProgressCount * 50) + (totalReports * 10);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Impact</h1>
          <p className="text-slate-500 mt-1">See how you're making the campus better, one report at a time.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm shadow-emerald-100">
          <Award className="text-emerald-600 w-6 h-6" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Impact Score</p>
            <p className="text-2xl font-black text-emerald-900 leading-none">{impactScore}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-24 h-24 text-indigo-600" />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Resolved Issues</p>
          <h2 className="text-5xl font-black text-slate-900">{resolvedCount}</h2>
          <p className="text-xs text-indigo-600 mt-4 font-bold">Successfully fixed by maintenance</p>
        </motion.div>

        <motion.div variants={item} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Zap className="w-24 h-24 text-amber-600" />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">In Progress</p>
          <h2 className="text-5xl font-black text-slate-900">{inProgressCount}</h2>
          <p className="text-xs text-amber-600 mt-4 font-bold">Being actively worked on</p>
        </motion.div>

        <motion.div variants={item} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-24 h-24 text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Campus Points</p>
          <h2 className="text-5xl font-black text-slate-900">{totalReports * 5}</h2>
          <p className="text-xs text-emerald-600 mt-4 font-bold">Points earned for participation</p>
        </motion.div>
      </div>

      {/* Recognition Section */}
      <motion.div variants={item} className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl -ml-20 -mb-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <Heart className="w-12 h-12 fill-white text-white animate-pulse" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-black mb-2">You're a Campus Hero!</h3>
            <p className="text-indigo-100 max-w-xl">
              By reporting issues, you're not just complaining—you're contributing to a safer and more comfortable environment for <strong>{totalReports * 15}+ other students</strong> in your department.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Impact Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={item} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
            <Users className="text-indigo-600 w-8 h-8" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-tighter">Community Voice</h4>
            <p className="text-slate-500 text-sm">Awarded for filing your first 3 complaints.</p>
            <div className="h-2 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-indigo-600" 
                style={{ width: `${Math.min((totalReports / 3) * 100, 100)}%` }} 
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
            <CheckCircle className="text-emerald-600 w-8 h-8" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-tighter">Issue Solver</h4>
            <p className="text-slate-500 text-sm">Awarded for seeing 5 issues through to resolution.</p>
            <div className="h-2 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-emerald-600" 
                style={{ width: `${Math.min((resolvedCount / 5) * 100, 100)}%` }} 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyImpact;
