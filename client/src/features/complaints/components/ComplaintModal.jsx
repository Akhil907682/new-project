import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createComplaint, resetCreateStatus } from '../complaintSlice';
import { Send, X, HelpCircle, Loader2, Sparkles, AlertCircle, Camera, Image as ImageIcon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeText, enhanceText, clearEnhancedText } from '../../ai/aiSlice';
import SuccessOverlay from '../../../shared/components/SuccessOverlay';

const ComplaintModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electrical',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [autoPriority, setAutoPriority] = useState('Low');
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { title, description, category } = formData;

  const dispatch = useDispatch();
  const { createStatus } = useSelector((state) => state.complaint);
  
  const { 
    isLoading: aiLoading, 
    analysis, 
    enhancedText 
  } = useSelector((state) => state.ai);

  const resetForm = useCallback(() => {
    setFormData({ title: '', description: '', category: 'Electrical' });
    setImage(null);
    setPreview((currentPreview) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return null;
    });
    setAutoPriority('Low');
  }, []);

  // Apply enhanced text when available
  useEffect(() => {
    if (enhancedText) {
      setFormData(prev => ({ ...prev, description: enhancedText }));
      dispatch(clearEnhancedText());
    }
  }, [enhancedText, dispatch]);

  // Apply AI analysis when available
  useEffect(() => {
    if (analysis) {
      setAutoPriority(analysis.priority);
      setFormData(prev => ({ ...prev, category: analysis.category }));
    }
  }, [analysis]);

  useEffect(() => {
    if (createStatus.isError) {
      setSubmitError(createStatus.message);
      dispatch(resetCreateStatus());
    }

    if (createStatus.isSuccess) {
      resetForm();
      setSubmitError('');
      setShowSuccess(true);
      dispatch(resetCreateStatus());
    }
  }, [createStatus, dispatch, resetForm]);

  const handleSuccessFinish = () => {
    setShowSuccess(false);
    onClose();
  };

  const handleClose = () => {
    resetForm();
    setSubmitError('');
    dispatch(resetCreateStatus());
    onClose();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'description') {
      // Clear previous timeout
      if (window.analyzeTimeout) clearTimeout(window.analyzeTimeout);
      
      // Debounce AI analysis - Reduced to 500ms for faster feedback
      window.analyzeTimeout = setTimeout(() => {
        if (value.trim().length > 10) {
          dispatch(analyzeText(value));
        }
      }, 500);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview((currentPreview) => {
        if (currentPreview) URL.revokeObjectURL(currentPreview);
        return URL.createObjectURL(file);
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (createStatus.isLoading) return;
    setSubmitError('');
    
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('category', category);
    data.append('priority', autoPriority);
    if (image) {
      data.append('image', image);
    }
    
    dispatch(createComplaint(data));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-indigo-600 px-8 py-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-indigo-200" />
                File a Complaint
              </h2>
              <p className="text-indigo-100 text-sm mt-1">Submit your issue for rapid resolution</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="title">Headline / Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={onChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                placeholder="Brief summary of the issue"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={onChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer shadow-sm"
              >
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Internet">Internet</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex justify-between" htmlFor="description">
                <span>Detailed Description</span>
                <button 
                  type="button"
                  onClick={() => dispatch(enhanceText(description))}
                  disabled={aiLoading || !description.trim()}
                  className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-tighter transition-colors disabled:opacity-50"
                >
                  {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  AI Enhance
                </button>
              </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={onChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none shadow-sm"
                  placeholder="Describe the issue. Tip: Keywords like 'leaking', 'fire', or 'broken' help determine priority."
                  required
                ></textarea>

                {description && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2"
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggested Priority:</span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm border ${
                      autoPriority === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                      autoPriority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      <Zap className={`w-3 h-3 ${autoPriority === 'High' ? 'fill-red-500' : autoPriority === 'Medium' ? 'fill-amber-500' : 'fill-blue-500'}`} />
                      {autoPriority}
                    </div>
                  </motion.div>
                )}
              </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
              <p>Your report will be automatically prioritized based on our AI-powered analysis of your description.</p>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 block">Attach Evidence (Optional)</label>
              
              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-indigo-300 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="mb-2 text-sm text-slate-700">
                      <span className="font-bold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">PNG, JPG or WEBP (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                </label>
              ) : (
                <div className="relative group rounded-3xl overflow-hidden border border-slate-200 shadow-md h-48">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview((currentPreview) => {
                          if (currentPreview) URL.revokeObjectURL(currentPreview);
                          return null;
                        });
                      }}
                      className="bg-red-600 text-white p-3 rounded-2xl shadow-xl hover:bg-red-700 transition-all transform hover:scale-110"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2 shadow-lg">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-700 truncate">{image?.name}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-4">
              {submitError && (
                <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {submitError}
                </p>
              )}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createStatus.isLoading}
                  className="flex-[2] bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  {createStatus.isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      <SuccessOverlay
        isOpen={showSuccess}
        message="Complaint Filed!"
        subMessage="Our team has received your report and will begin triaging it shortly."
        onClose={handleSuccessFinish}
      />
    </AnimatePresence>
  );
};

export default ComplaintModal;
