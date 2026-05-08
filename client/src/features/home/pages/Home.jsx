import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import { motion } from 'framer-motion';
import { ShieldAlert, MessageSquare, ArrowRight, Zap, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-0 overflow-x-hidden selection:bg-indigo-100"
    >
      <Hero />
      <Stats />
      <Process />
      <Features />
      <Testimonials />
      
      {/* Professional CTA Section */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-indigo-600 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden shadow-2xl shadow-indigo-200">
            {/* Geometric accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="text-center lg:text-left max-w-2xl">
                <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight">
                  Ready to optimize your campus operations?
                </h2>
                <p className="text-indigo-100 text-xl mb-12 font-medium">
                  Join hundreds of academic institutions that trust CampusGuard for high-integrity resolution management.
                </p>
                <div className="flex flex-wrap gap-10 justify-center lg:justify-start">
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                       <Zap className="w-5 h-5 text-amber-300" />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-xs">Fast Resolution</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                       <Lock className="w-5 h-5 text-indigo-300" />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-xs">Privacy First</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-auto min-w-[320px]">
                <div className="bg-white p-10 lg:p-12 rounded-[2rem] shadow-2xl text-center">
                  <div className="flex justify-center -space-x-4 mb-8">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/150?u=saas_${i}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <h3 className="text-slate-900 text-xl font-black mb-8 italic">
                    "The gold standard for university integrity."
                  </h3>
                  
                  <Link to={user ? (user.role === 'admin' ? "/admin/dashboard" : "/student/dashboard") : "/register"}>
                    <motion.button 
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-xl shadow-indigo-900/10 flex items-center justify-center gap-3"
                    >
                      {user ? 'Open Dashboard' : 'Get Started Now'}
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  <p className="mt-6 text-slate-400 text-sm font-bold uppercase tracking-widest">
                    Free for students & faculty
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </motion.div>
  );
};

export default Home;
