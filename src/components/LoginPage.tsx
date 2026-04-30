import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Scale, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: (status: boolean) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved credentials on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('posbakum_saved_user');
    const savedPass = localStorage.getItem('posbakum_saved_pass');
    
    if (savedUser && savedPass) {
      setUsername(savedUser);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulated login logic
    setTimeout(() => {
      // Simple validation for demo purposes
      // Default: admin / admin123
      if (username === 'admin' && password === 'admin123') {
        if (rememberMe) {
          localStorage.setItem('posbakum_saved_user', username);
          localStorage.setItem('posbakum_saved_pass', password);
        } else {
          localStorage.removeItem('posbakum_saved_user');
          localStorage.removeItem('posbakum_saved_pass');
        }
        onLogin(true);
      } else {
        setError('Username atau Password salah. Silakan coba lagi.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-brand-sidebar rounded-2xl shadow-2xl mb-4 border-2 border-brand-primary">
            <Scale className="text-brand-primary" size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">POSBAKUM</h1>
          <p className="text-[11px] text-blue-600 font-bold uppercase tracking-[0.3em] mt-1">PA BANJARMASIN IA</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-100 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 z-0" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck className="text-blue-600" size={24} />
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Login Petugas</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800"
                    placeholder="Masukkan username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Ingat Saya</span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 border border-red-100 animate-shake">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  <span className="text-xs font-bold uppercase tracking-tight">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-sidebar text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk ke Dashboard'
                )}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Pengadilan Agama Banjarmasin Kelas IA
              </p>
              <div className="flex justify-center gap-1 mt-1 text-[9px] text-slate-300 font-bold uppercase tracking-tighter">
                <span>© 2026</span>
                <span>•</span>
                <span>Pusat Data Posbakum</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
