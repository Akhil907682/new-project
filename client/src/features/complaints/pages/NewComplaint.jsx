import { useState } from 'react';
import ComplaintModal from '../components/ComplaintModal';
import { FilePlus, Send, ShieldCheck } from 'lucide-react';

const NewComplaint = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">File a Complaint</h1>
          <p className="text-slate-500 mt-1">Submit a new campus issue for resolution</p>
        </div>
      </div>

      {/* Prompt Card when modal is closed */}
      {!isModalOpen && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="bg-indigo-50 p-6 rounded-3xl">
              <FilePlus className="w-12 h-12 text-indigo-600" />
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="text-xl font-bold text-slate-900">Ready to Submit a Complaint?</h2>
              <p className="text-slate-500 text-sm">
                Click the button below to open the complaint form. Provide a clear description and attach any evidence to help us resolve your issue faster.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              Open Complaint Form
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Your complaints are reviewed and tracked by the admin team</span>
            </div>
          </div>
        </div>
      )}

      <ComplaintModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default NewComplaint;
