import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-24 bg-white border-t border-slate-100 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 text-indigo-600 font-black text-3xl tracking-tighter mb-8">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <span>CampusGuard</span>
            </div>
            <p className="text-slate-500 max-w-sm text-lg font-medium leading-relaxed">
              The institutional platform for secure, transparent, and rapid campus resolution management. Built for students, trusted by administration.
            </p>
          </div>
          
          <div className="flex flex-col gap-6">
            <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs">Platform</h4>
            <Link to="/security" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Security</Link>
            <Link to="/features" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Features</Link>
          </div>
          
          <div className="flex flex-col gap-6">
            <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs">Support</h4>
            <Link to="/help" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Help Center</Link>
            <Link to="/privacy" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Contact Us</Link>
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-slate-400 text-sm font-medium">
            &copy; 2026 CampusGuard Security & Integrity Platform.
          </div>
          <div className="flex gap-6 text-slate-400 text-sm">
             <Globe className="w-5 h-5" />
             <span>English (United States)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
