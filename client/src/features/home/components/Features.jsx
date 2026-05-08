import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeatureDetailModal from './FeatureDetailModal';
import { FEATURE_DATA } from '../data/featureData';

const Features = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLearnMore = (feature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight"
            >
              Excellence in <br /> 
              campus management.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-500 font-medium leading-relaxed"
            >
              CampusGuard provides the professional infrastructure required to handle complex campus ecosystems with ease.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-auto flex justify-center lg:justify-start"
          >
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/features')}
              className="px-10 py-4 rounded-full bg-indigo-600 text-white font-black border-2 border-slate-950 shadow-xl shadow-indigo-200/50 hover:bg-slate-900 hover:border-indigo-600 transition-all text-sm uppercase tracking-[0.2em]"
            >
              Explore All Features
            </motion.button>
          </motion.div>
        </div>
        
        <div id="features-grid" className="grid md:grid-cols-2 gap-px bg-slate-100 rounded-3xl overflow-hidden border border-slate-100">
          {FEATURE_DATA.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white p-12 lg:p-16 hover:bg-slate-50/50 transition-all duration-500"
            >
              <div className="flex flex-col h-full">
                <div className="mb-8 flex justify-between items-start">
                  <div className="p-4 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 text-indigo-600">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[3px] py-1 px-3 bg-slate-100 rounded-full text-slate-500 group-hover:text-slate-700 transition-colors">
                    {feature.tag}
                  </span>
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                  {feature.description}
                </p>
                
                  <div className="mt-auto pt-10">
                     <div 
                      onClick={() => handleLearnMore(feature)}
                      className="flex items-center gap-2 text-slate-900 font-bold group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-500 cursor-pointer"
                    >
                       Learn More <ArrowRight className="w-5 h-5" />
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <FeatureDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          feature={selectedFeature} 
        />
      </section>
    );
  };



export default Features;
