import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { BatchEvent } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';

const Calendar: React.FC = () => {
  const { profile } = useAuth();
  const [events, setEvents] = useState<BatchEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BatchEvent)));
    });
    return () => unsubscribe();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = event.date?.toDate ? event.date.toDate() : new Date();
      return isSameDay(eventDate, day);
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Batch Calendar</h1>
          <p className="text-gray-500">Stay updated with exams, classes, and social events.</p>
        </div>
        {profile?.role === 'admin' && (
          <button className="flex items-center justify-center gap-2 bg-bup-green text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-900 transition-colors shadow-lg shadow-emerald-900/20">
            <Plus size={20} />
            Add Event
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bup-gradient p-6 text-white flex items-center justify-between">
            <h2 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                &larr;
              </button>
              <button 
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                &rarr;
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 border-b border-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              return (
                <div 
                  key={day.toString()} 
                  className={cn(
                    "min-h-[100px] p-2 border-r border-b border-gray-50 relative group",
                    !isSameDay(day, currentDate) && "bg-gray-50/30",
                    isToday(day) && "bg-bup-green/5"
                  )}
                >
                  <span className={cn(
                    "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1",
                    isToday(day) ? "bg-bup-green text-white" : "text-gray-600"
                  )}>
                    {format(day, 'd')}
                  </span>
                  <div className="space-y-1">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id}
                        className={cn(
                          "text-[10px] p-1 rounded font-bold truncate",
                          event.type === 'exam' ? "bg-red-100 text-red-600" :
                          event.type === 'class' ? "bg-blue-100 text-blue-600" :
                          event.type === 'social' ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Upcoming Events</h3>
          <div className="space-y-4">
            {events.filter(e => {
              const d = e.date?.toDate ? e.date.toDate() : new Date();
              return d >= new Date();
            }).slice(0, 5).map((event) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0",
                  event.type === 'exam' ? "bg-red-50 text-red-600" :
                  event.type === 'class' ? "bg-blue-50 text-blue-600" :
                  event.type === 'social' ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-600"
                )}>
                  <span className="text-[10px] font-black uppercase">{event.date?.toDate ? format(event.date.toDate(), 'MMM') : '...'}</span>
                  <span className="text-lg font-black leading-none">{event.date?.toDate ? format(event.date.toDate(), 'd') : '0'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{event.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock size={12} />
                    {event.date?.toDate ? format(event.date.toDate(), 'h:mm a') : 'TBD'}
                  </div>
                </div>
              </motion.div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <CalendarIcon className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-gray-400 text-sm">No upcoming events.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Calendar;
