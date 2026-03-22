import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AcademicResource } from '../types';
import { useAuth } from '../AuthContext';
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Filter,
  Plus,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

const Resources: React.FC = () => {
  const { profile } = useAuth();
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    subject: '',
    type: 'CT' as AcademicResource['type'],
    fileUrl: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AcademicResource)));
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      await addDoc(collection(db, 'resources'), {
        ...newResource,
        uploadedBy: profile.uid,
        createdAt: serverTimestamp()
      });
      setIsUploadModalOpen(false);
      setNewResource({ title: '', subject: '', type: 'CT', fileUrl: '' });
    } catch (error) {
      console.error('Error uploading resource:', error);
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         res.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || res.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Academic Resources</h1>
          <p className="text-gray-500">Access CT, Mid, and Final questions shared by the batch.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-bup-green text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-900 transition-colors shadow-lg shadow-emerald-900/20"
        >
          <Plus size={20} />
          Upload Resource
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by title or subject..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-bup-green/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select 
            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bup-green/20 transition-all font-medium"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="CT">CT Questions</option>
            <option value="Mid">Mid Questions</option>
            <option value="Final">Final Questions</option>
            <option value="Other">Other Materials</option>
          </select>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <motion.div 
            key={res.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-bup-green/5 rounded-2xl flex items-center justify-center text-bup-green group-hover:bg-bup-green group-hover:text-white transition-colors duration-300">
                <FileText size={28} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                res.type === 'Final' ? 'bg-red-100 text-red-600' : 
                res.type === 'Mid' ? 'bg-orange-100 text-orange-600' : 
                res.type === 'CT' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {res.type}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{res.title}</h3>
            <p className="text-sm text-gray-500 mb-6">{res.subject}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <div className="text-xs text-gray-400">
                {res.createdAt?.toDate ? format(res.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}
              </div>
              <a 
                href={res.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-bup-green font-bold text-sm hover:underline"
              >
                <Download size={16} />
                Download
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute inset-0 bg-bup-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="bup-gradient p-6 text-white flex items-center justify-between">
                <h3 className="text-xl font-bold">Upload Resource</h3>
                <button onClick={() => setIsUploadModalOpen(false)} className="hover:bg-white/10 p-1 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUpload} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., CT-1 Question 2024"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-bup-green/20"
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Subject</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., Data Structures"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-bup-green/20"
                    value={newResource.subject}
                    onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Type</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-bup-green/20"
                      value={newResource.type}
                      onChange={(e) => setNewResource({...newResource, type: e.target.value as AcademicResource['type']})}
                    >
                      <option value="CT">CT</option>
                      <option value="Mid">Mid</option>
                      <option value="Final">Final</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">File URL</label>
                    <input 
                      required
                      type="url" 
                      placeholder="Google Drive link"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-bup-green/20"
                      value={newResource.fileUrl}
                      onChange={(e) => setNewResource({...newResource, fileUrl: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-bup-green text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all"
                >
                  Confirm Upload
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Resources;
