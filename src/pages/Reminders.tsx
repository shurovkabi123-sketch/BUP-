import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { FacultyReminder } from '../types';
import { useAuth } from '../AuthContext';
import { 
  Bell, 
  Clock, 
  User, 
  AlertCircle,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

const Reminders: React.FC = () => {
  const { profile } = useAuth();
  const [reminders, setReminders] = useState<FacultyReminder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    content: '',
    facultyName: '',
    dueDate: '',
    priority: 'medium' as FacultyReminder['priority']
  });

  useEffect(() => {
    const q = query(collection(db, 'reminders'), orderBy('dueDate', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReminders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FacultyReminder)));
    });
    return () => unsubscribe();
  }, []);

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || profile.role !== 'admin') return;

    try {
      await addDoc(collection(db, 'reminders'), {
        ...newReminder,
        dueDate: new Date(newReminder.dueDate),
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewReminder({ content: '', facultyName: '', dueDate: '', priority: 'medium' });
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Faculty Reminders</h1>
          <p className="text-gray-500">Important deadlines and announcements from your instructors.</p>
        </div>
        {profile?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-bup-green text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-900 transition-colors shadow-lg shadow-emerald-900/20"
          >
            <Plus size={20} />
            Post Reminder
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reminders.map((rem, i) => (
          <motion.div 
            key={rem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all"
          >
            <div className={cn(
              "absolute top-0 left-0 w-2 h-full",
              rem.priority === 'high' ? "bg-red-500" : 
              rem.priority === 'medium' ? "bg-yellow-500" : "bg-blue-500"
            )}></div>
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-bup-green transition-colors">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{rem.priority} Priority</p>
                  <h3 className="font-bold text-gray-900">{rem.facultyName}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                <Clock size={14} />
                {rem.dueDate?.toDate ? format(rem.dueDate.toDate(), 'MMM d, h:mm a') : 'Upcoming'}
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">{rem.content}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle2 size={14} className="text-green-500" />
                Active Announcement
              </div>
              <button className="text-bup-green font-bold text-sm hover:underline">
                Mark as Read
              </button>
            </div>
          </motion.div>
        ))}
        {reminders.length === 0 && (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-400">No active reminders</h3>
            <p className="text-gray-400">Check back later for faculty updates.</p>
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-bup-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="bup-gradient p-6 text-white flex items-center justify-between">
                <h3 className="text-xl font-bold">Post New Reminder</h3>
                <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-1 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddReminder} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Faculty Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., Dr. John Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-bup-green/20"
                    value={newReminder.facultyName}
                    onChange={(e) => setNewReminder({...newReminder, facultyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Reminder Content</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Enter the announcement details..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-bup-green/20 resize-none"
                    value={newReminder.content}
                    onChange={(e) => setNewReminder({...newReminder, content: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Due Date</label>
                    <input 
                      required
                      type="datetime-local" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-bup-green/20"
                      value={newReminder.dueDate}
                      onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Priority</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-bup-green/20"
                      value={newReminder.priority}
                      onChange={(e) => setNewReminder({...newReminder, priority: e.target.value as FacultyReminder['priority']})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-bup-green text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all"
                >
                  Post Announcement
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Reminders;
