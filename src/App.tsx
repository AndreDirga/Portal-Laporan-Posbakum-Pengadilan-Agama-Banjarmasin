import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  PlusCircle, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Scale,
  Calendar as CalendarIcon,
  Users,
  Clock,
  MapPin,
  Briefcase,
  FileText
} from 'lucide-react';
import { DailyReport } from './types';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import DashboardHome from './components/DashboardHome';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'input' | 'data'>('dashboard');
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedReports = localStorage.getItem('posbakum_reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error('Failed to parse reports', e);
      }
    }
  }, []);

  // Save data to localStorage when reports change
  useEffect(() => {
    localStorage.setItem('posbakum_reports', JSON.stringify(reports));
  }, [reports]);

  const addReport = (newReport: DailyReport) => {
    setReports([newReport, ...reports]);
    setActiveTab('data');
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-800 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-brand-sidebar text-white border-r-4 border-brand-primary transition-all duration-300 ease-in-out fixed inset-y-0 z-50 flex flex-col shadow-xl",
          isSidebarOpen ? "w-[320px]" : "w-20"
        )}
      >
        <div className="p-8 flex items-center gap-4 border-b border-slate-800">
          <div className="bg-brand-primary p-2.5 rounded-lg text-white shadow-lg shadow-blue-500/20">
            <Scale size={28} />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="font-black text-2xl leading-none tracking-tighter">POSBAKUM</h1>
              <p className="text-[11px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">PA BANJARMASIN IA</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-3 mt-8">
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Dashboard Overview" 
            active={activeTab === 'dashboard'} 
            expanded={isSidebarOpen}
            onClick={() => setActiveTab('dashboard')}
          />
          <SidebarItem 
            icon={<PlusCircle size={20} />} 
            label="Input Laporan Harian" 
            active={activeTab === 'input'} 
            expanded={isSidebarOpen}
            onClick={() => setActiveTab('input')}
          />
          <SidebarItem 
            icon={<ClipboardList size={20} />} 
            label="Riwayat Layanan" 
            active={activeTab === 'data'} 
            expanded={isSidebarOpen}
            onClick={() => setActiveTab('data')}
          />
        </nav>

        <div className="p-6 border-t border-slate-800 mb-4">
          {isSidebarOpen && (
            <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Status Petugas</p>
              <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-blue-400 border border-slate-600">
                   PB
                </div>
                <div>
                  <p className="text-sm font-bold">Admin Posbakum</p>
                  <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> AKTIF • ONLINE
                  </p>
                </div>
              </div>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Sembunyikan</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "ml-[320px]" : "ml-20"
      )}>
        {/* Header */}
        <header className="h-24 bg-white/50 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-12 sticky top-0 z-40">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              {activeTab === 'dashboard' ? (
                <>Statistik <span className="text-blue-600">Layanan</span></>
              ) : activeTab === 'input' ? (
                <>Formulir <span className="text-blue-600">Pelaporan</span></>
              ) : (
                <>Riwayat <span className="text-blue-600">Layanan</span></>
              )}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Data Per Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="h-10 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-black text-slate-800">Admin Posbakum</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Advokat Posbakum</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-sidebar border-2 border-white shadow-xl flex items-center justify-center text-white overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardHome reports={reports} />
              )}
              {activeTab === 'input' && (
                <ReportForm onSubmit={addReport} />
              )}
              {activeTab === 'data' && (
                <ReportList reports={reports} onDelete={deleteReport} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}

function SidebarItem({ icon, label, active, expanded, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden",
        active 
          ? "bg-brand-primary text-white shadow-xl shadow-blue-500/20" 
          : "text-slate-400 hover:text-white hover:bg-slate-800/80"
      )}
    >
      <div className={cn("transition-transform duration-300 shrink-0", active && "scale-110")}>
        {icon}
      </div>
      {expanded && (
        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          {label}
        </span>
      )}
      {!expanded && active && (
        <div className="absolute right-0 w-1.5 h-8 bg-white rounded-l-full" />
      )}
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50" />
      )}
    </button>
  );
}


