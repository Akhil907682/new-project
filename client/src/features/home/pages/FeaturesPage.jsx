import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FEATURE_DATA } from '../data/featureData';
import { ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import FeatureDetailModal from '../components/FeatureDetailModal';

const FeaturesPage = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLearnMore = (feature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 pt-32 pb-20 overflow-x-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header section with floating elements */}
        <div className="max-w-4xl mx-auto text-center mb-24 relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-5 py-2 bg-white shadow-sm border border-slate-100 text-indigo-600 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 inline-block">
              Institutional Excellence
            </span>
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
              Powerful tools for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">modern campuses.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Everything you need to manage complaints, automate workflows, and build a more transparent university environment.
            </p>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {FEATURE_DATA.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-[2.5rem] p-10 lg:p-14 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[4rem] -translate-y-8 translate-x-8 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500 -z-10"></div>
              
              <div className="flex flex-col h-full relative z-10">
                <div className="mb-10 flex justify-between items-start">
                  <div className="p-5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[3px] py-1.5 px-4 bg-slate-50 border border-slate-100 rounded-full text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-100 transition-all">
                    {feature.tag}
                  </span>
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-lg text-slate-500 leading-relaxed font-medium mb-10">
                  {feature.description}
                </p>
                
                <div className="mt-auto space-y-8">
                  <div className="flex flex-wrap gap-3">
                    {feature.benefits.slice(0, 2).map((benefit, i) => (
                      <span key={i} className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                         <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
                         {benefit}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => handleLearnMore(feature)}
                    className="w-full py-5 px-8 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 group-hover:bg-indigo-600 transition-all shadow-lg"
                  >
                    View Specifications
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Stats / Badges */}
        <div className="mt-40 flex flex-wrap justify-center gap-16 lg:gap-32">
          {[
            { icon: <Shield className="w-6 h-6" />, label: "Privacy First" },
            { icon: <Zap className="w-6 h-6" />, label: "Instant Triage" },
            { icon: <Sparkles className="w-6 h-6" />, label: "AI Optimized" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4 text-slate-400 group">
              <div className="w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-400 group-hover:text-indigo-600 transition-all duration-500">
                {item.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <FeatureDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        feature={selectedFeature} 
      />
    </motion.div>
  );
};

export default FeaturesPage;
