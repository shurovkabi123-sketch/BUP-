import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase';
import { AcademicResource, FacultyReminder, BatchEvent } from '../types';
import { 
  BookOpen, 
  Bell, 
  Calendar as CalendarIcon, 
  ArrowRight,
  Clock,
  FileText,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [reminders, setReminders] = useState<FacultyReminder[]>([]);
  const [events, setEvents] = useState<BatchEvent[]>([]);

  useEffect(() => {
    // Fetch latest resources
    const qResources = query(collection(db, 'resources'), orderBy('createdAt', 'desc'), limit(3));
    const unsubResources = onSnapshot(qResources, (snapshot) => {
      setResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AcademicResource)));
    });

    // Fetch active reminders
    const qReminders = query(collection(db, 'reminders'), orderBy('dueDate', 'asc'), limit(3));
    const unsubReminders = onSnapshot(qReminders, (snapshot) => {
      setReminders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FacultyReminder)));
    });

    // Fetch upcoming events
    const qEvents = query(collection(db, 'events'), orderBy('date', 'asc'), limit(3));
    const unsubEvents = onSnapshot(qEvents, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BatchEvent)));
    });

    return () => {
      unsubResources();
      unsubReminders();
      unsubEvents();
    };
  }, []);

  const stats = [
    { label: 'Total Resources', value: '124', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Upcoming Exams', value: '3', icon: AlertCircle, color: 'bg-red-500' },
    { label: 'Batch Students', value: '65', icon: CalendarIcon, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section className="relative rounded-3xl bup-gradient p-10 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-4">Welcome to BICE Portal</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Everything you need for your academic journey in the ICT department. 
            Check reminders, download questions, and stay updated with the batch calendar.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5"
          >
            <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Resources */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Recent Resources</h3>
            <button className="text-bup-green font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {resources.length > 0 ? resources.map((res) => (
              <div key={res.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
                <div className="w-12 h-12 bg-bup-green/5 rounded-xl flex items-center justify-center text-bup-green">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{res.title}</h4>
                  <p className="text-sm text-gray-500">{res.subject} • {res.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{res.createdAt?.toDate ? format(res.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}</p>
                </div>
              </div>
            )) : (
              <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
                <p className="text-gray-400">No resources uploaded yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Faculty Reminders */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Faculty Reminders</h3>
            <button className="text-bup-green font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {reminders.length > 0 ? reminders.map((rem) => (
              <div key={rem.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
                      rem.priority === 'high' ? "bg-red-100 text-red-600" : 
                      rem.priority === 'medium' ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {rem.priority} Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    {rem.dueDate?.toDate ? format(rem.dueDate.toDate(), 'MMM d, h:mm a') : 'Upcoming'}
                  </div>
                </div>
                <p className="text-gray-800 font-medium mb-2">{rem.content}</p>
                <p className="text-xs text-gray-500">— {rem.facultyName}</p>
              </div>
            )) : (
              <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
                <p className="text-gray-400">No active reminders.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Dashboard;
