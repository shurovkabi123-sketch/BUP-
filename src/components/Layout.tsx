import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar as CalendarIcon, 
  Bell, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Academic Resources', path: '/resources', icon: BookOpen },
    { name: 'Student Directory', path: '/directory', icon: Users },
    { name: 'Batch Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Reminders', path: '/reminders', icon: Bell },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-72 bup-gradient text-white flex flex-col fixed inset-y-0 z-50 shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Bangladesh_University_of_Professionals_Logo.svg/1200px-Bangladesh_University_of_Professionals_Logo.svg.png" 
                    alt="BUP Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-tight">BUP BICE</h1>
                  <p className="text-xs text-white/60">2025 ICT Batch</p>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    location.pathname === item.path 
                      ? "bg-white text-bup-green shadow-lg" 
                      : "hover:bg-white/10 text-white/80 hover:text-white"
                  )}
                >
                  <item.icon size={20} className={cn(
                    "transition-transform duration-200 group-hover:scale-110",
                    location.pathname === item.path ? "text-bup-green" : "text-white/60"
                  )} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center overflow-hidden border-2 border-white/20">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="text-bup-green" size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{profile?.displayName}</p>
                  <p className="text-xs text-white/50 truncate">{profile?.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isSidebarOpen ? "lg:ml-72" : "ml-0"
      )}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold text-bup-green">
              {navItems.find(item => item.path === location.pathname)?.name || 'Portal'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{profile?.displayName}</p>
                <p className="text-xs text-gray-500">{profile?.studentId || 'ID not set'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
