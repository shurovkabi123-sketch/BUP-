import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';
import { LogIn, GraduationCap, ShieldCheck, Users, IdCard, Lock, Mail, UserPlus } from 'lucide-react';

const Login: React.FC = () => {
  const { login, register, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await register(studentId, password, displayName, email);
      } else {
        await login(studentId, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bup-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        {/* Left Side - Branding */}
        <div className="bup-gradient p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl mb-8">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Bangladesh_University_of_Professionals_Logo.svg/1200px-Bangladesh_University_of_Professionals_Logo.svg.png" 
                alt="BUP Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-4 leading-tight">
              BUP BICE <br />
              <span className="text-emerald-300 italic">Batch 2025</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xs">
              The official portal for Information and Communication Engineering students.
            </p>
          </div>

          <div className="space-y-6 relative">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <GraduationCap size={20} className="text-emerald-300" />
              </div>
              <p className="text-sm font-medium">Academic Resources & Questions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Users size={20} className="text-emerald-300" />
              </div>
              <p className="text-sm font-medium">Student Directory & Profiles</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-emerald-300" />
              </div>
              <p className="text-sm font-medium">Secure Batch Portal Access</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-500">
                {isRegistering 
                  ? 'Join the BICE 2025 batch portal today.' 
                  : 'Please sign in with your Student ID to access the portal.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {isRegistering && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-bup-green/20 transition-all font-medium"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Personal Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-bup-green/20 transition-all font-medium"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Student ID</label>
                <div className="relative">
                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., 25.01.04.001"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-bup-green/20 transition-all font-medium"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-bup-green/20 transition-all font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full bg-bup-green text-white py-4 px-6 rounded-2xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all font-black text-lg flex items-center justify-center gap-2"
              >
                {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
                {isRegistering ? 'Create Account' : 'Sign In'}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm font-bold text-bup-green hover:underline"
              >
                {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
              </button>
            </div>

            <div className="mt-10 pt-10 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mb-4">Department of ICT</p>
              <p className="text-xs text-gray-400">
                &copy; 2026 BUP BICE Batch. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
