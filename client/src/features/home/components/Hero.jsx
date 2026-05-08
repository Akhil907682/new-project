import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import mockupImage from '../../../assets/product-mockup.png';

const Hero = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-0 overflow-hidden bg-white">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left z-10 lg:pb-32"
          >
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span>Trustworthy Campus Solutions</span>
            </motion.div>
            
            <h1 className="text-5xl lg:text-[4.5rem] font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
              The Modern Standard for <br />
              <span className="text-indigo-600 italic">Campus Resolution.</span>
            </h1>
            
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Join the institutional platform designed to bridge the gap between students and management with unprecedented security, speed, and transparency.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              <Link to={user ? (user.role === 'admin' ? "/admin/dashboard" : "/student/dashboard") : "/register"} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  {user ? 'Go to Dashboard' : 'Get Started'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="mt-16 flex flex-wrap items-center gap-8 justify-center lg:justify-start opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-slate-400 font-bold tracking-widest text-xs uppercase">Integrations</span>
              <div className="h-6 w-24 bg-slate-300 rounded-lg"></div>
              <div className="h-6 w-32 bg-slate-300 rounded-lg"></div>
              <div className="h-6 w-20 bg-slate-300 rounded-lg"></div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex-1 relative mt-16 lg:mt-0"
          >
            <div className="relative z-10 w-full max-w-4xl mx-auto lg:translate-x-12 translate-y-12">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <img 
                  src={mockupImage} 
                  alt="CampusGuard Dashboard Mockup" 
                  className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] rounded-t-3xl border-t border-x border-slate-200 bg-white"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
