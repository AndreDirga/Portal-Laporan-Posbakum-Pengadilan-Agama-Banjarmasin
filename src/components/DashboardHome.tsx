import { DailyReport } from '../types';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Award,
  Scale
} from 'lucide-react';

interface DashboardHomeProps {
  reports: DailyReport[];
}

export default function DashboardHome({ reports }: DashboardHomeProps) {
  const totalReports = reports.length;
  const totalServiceSeekers = reports.reduce((acc, curr) => acc + (Number(curr.serviceSeekersCount) || 0), 0);
  
  // Calculate most requested case type
  const caseTypeCounts: Record<string, number> = {};
  reports.forEach(r => {
    caseTypeCounts[r.caseType] = (caseTypeCounts[r.caseType] || 0) + 1;
  });
  const mostRequestedCase = Object.entries(caseTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-10 text-white shadow-2xl border-b-4 border-blue-600">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-3">
            <div className="inline-block px-3 py-1 bg-blue-600 rounded text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              Sistem Pelaporan Harian
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">Selamat Datang di <br /> <span className="text-blue-500">Portal POSBAKUM</span></h1>
            <p className="text-slate-400 max-w-lg text-sm font-medium leading-relaxed">
              Manajemen data bantuan hukum Pengadilan Agama Banjarmasin Kelas IA. Pastikan integritas data untuk transparansi layanan.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-xl border border-slate-700 text-center min-w-[140px] shadow-lg">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Data Laporan</p>
                <p className="text-4xl font-black text-blue-500">{totalReports}</p>
             </div>
             <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-xl border border-slate-700 text-center min-w-[140px] shadow-lg">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Data Layanan</p>
                <p className="text-4xl font-black text-blue-500">{totalServiceSeekers}</p>
             </div>
          </div>
        </div>
        {/* Abstract background elements */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-none" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="text-blue-600" size={20} />} 
          label="Total Pemohon" 
          value={totalServiceSeekers.toString()} 
          subtext="Akumulatif Pengunjung"
        />
        <StatCard 
          icon={<FileText className="text-slate-400" size={20} />} 
          label="Input Hari Ini" 
          value={reports.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length.toString()} 
          subtext="Laporan Terverifikasi"
        />
        <StatCard 
          icon={<Award className="text-blue-600" size={20} />} 
          label="Top Klasifikasi" 
          value={mostRequestedCase} 
          subtext="Jenis Perkara Dominan"
        />
        <StatCard 
          icon={<Clock className="text-slate-400" size={20} />} 
          label="Standard Durasi" 
          value="25 Menit" 
          subtext="Rata-rata Pengerjaan"
        />
      </div>

      {/* Recent Activity Mini List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-3">
              <TrendingUp size={18} className="text-blue-500" />
              Aktivitas Pelaporan Terbaru
            </h3>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">Live Update</span>
          </div>
          <div className="divide-y divide-slate-100">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-black border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                    {report.parties[0]?.name.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-base">
                      {report.parties[0]?.name}
                      {report.parties.length > 1 && (
                        <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          +{report.parties.length - 1}
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-1 flex items-center gap-2">
                       <span className="text-blue-600">{report.caseType}</span> • {new Date(report.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded uppercase tracking-widest group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                     View
                  </div>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.2em]">Belum Ada Data Masuk</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 space-y-8">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Metrik Layanan</h3>
          <div className="space-y-6">
            <ServiceSummaryItem 
              label="Konsultasi Hukum" 
              count={reports.filter(r => r.providedService.includes('Konsultasi')).length} 
              total={reports.length}
              color="bg-blue-600"
            />
            <ServiceSummaryItem 
              label="Pembuatan Dokumen" 
              count={reports.filter(r => r.providedService.includes('Dokumen')).length} 
              total={reports.length}
              color="bg-slate-900"
            />
            <ServiceSummaryItem 
              label="Informasi Hukum" 
              count={reports.filter(r => r.providedService.includes('Informasi')).length} 
              total={reports.length}
              color="bg-blue-400"
            />
          </div>
          
          <div className="pt-6 border-t border-slate-100">
             <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl relative overflow-hidden group">
                <div className="relative z-10">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Instruksi Kerja</p>
                   <p className="text-[11px] text-blue-800 font-bold leading-relaxed">
                      Lakukan sinkronisasi data setiap akhir jam kerja untuk memastikan akurasi statistik harian.
                   </p>
                </div>
                <div className="absolute -right-4 -bottom-4 text-blue-100/50 group-hover:scale-110 transition-transform">
                   <Scale size={64} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext }: { icon: ReactNode, label: string, value: string, subtext: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter truncate">{value}</p>
        <div className="h-[1px] w-8 bg-blue-600 my-3" />
        <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">{subtext}</p>
      </div>
    </div>
  );
}

function ServiceSummaryItem({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
        <span>{label}</span>
        <span className="text-slate-900">{count}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

