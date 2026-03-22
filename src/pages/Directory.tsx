import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { 
  Users, 
  Search, 
  Mail, 
  IdCard,
  ExternalLink,
  User as UserIcon
} from 'lucide-react';
import { motion } from 'motion/react';

const Directory: React.FC = () => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('displayName', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile)));
    });
    return () => unsubscribe();
  }, []);

  const filteredStudents = students.filter(student => 
    student.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Student Directory</h1>
        <p className="text-gray-500">Connect with your batchmates in BICE 2025.</p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, ID, or email..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-bup-green/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStudents.map((student) => (
          <motion.div 
            key={student.uid}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
          >
            <div className="h-24 bup-gradient relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                    {student.photoURL ? (
                      <img src={student.photoURL} alt={student.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="text-gray-400" size={32} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-12 p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{student.displayName}</h3>
              <p className="text-xs font-black text-bup-green uppercase tracking-widest mb-4">
                {student.role}
              </p>
              
              <div className="space-y-3 text-sm text-gray-500 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <IdCard size={14} className="text-gray-400" />
                  <span>{student.studentId || 'ID Not Set'}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span className="truncate max-w-[150px]">{student.email}</span>
                </div>
              </div>

              <a 
                href={`mailto:${student.email}`}
                className="inline-flex items-center gap-2 text-bup-green font-bold text-sm hover:underline"
              >
                Send Message
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Directory;
