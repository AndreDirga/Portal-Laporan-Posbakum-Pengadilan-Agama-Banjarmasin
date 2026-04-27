import { DailyReport } from '../types';
import * as XLSX from 'xlsx';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  MoreVertical,
  Eye,
  FileSpreadsheet,
  MapPin,
  Clock,
  Briefcase,
  User,
  Scale
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

interface ReportListProps {
  reports: DailyReport[];
  onDelete: (id: string) => void;
}

export default function ReportList({ reports, onDelete }: ReportListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);

  const filteredReports = reports.filter(r => 
    r.parties.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    r.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.providerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportExcel = () => {
    if (reports.length === 0) return;

    // Flatten data for excel to match the requested format with multiple parties
    let reportNumber = 1;
    const excelData = reports.flatMap(report => {
      const currentNo = reportNumber++;
      return report.parties.map((party, index) => ({
        'No.': currentNo,
        'Tanggal': report.date,
        'Nama': report.parties.length > 1 ? `${party.name} (Pihak Ke-${index + 1})` : party.name,
        'Alamat': party.address,
        'Usia': party.age,
        'Jenis Kelamin': party.gender,
        'Pekerjaan': party.occupation,
        'Jenis Perkara': report.caseType,
        'Jumlah Pemohon Layanan': report.serviceSeekersCount,
        'Jenis Layanan Bantuan Hukum Yang Dimohon': report.requestedService,
        'Jenis Layanan Bantuan Hukum Yang Diberikan': report.providedService,
        'Nama Pemberi Jasa': report.providerName,
        'Durasi / Menit': report.duration
      }));
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths for better readability
    const wscols = [
      {wch: 5},  // No.
      {wch: 15}, // Tanggal
      {wch: 25}, // Nama
      {wch: 35}, // Alamat
      {wch: 8},  // Usia
      {wch: 12}, // Jenis Kelamin
      {wch: 20}, // Pekerjaan
      {wch: 20}, // Jenis Perkara
      {wch: 15}, // Jumlah Pemohon
      {wch: 35}, // Dimohon
      {wch: 35}, // Diberikan
      {wch: 20}, // Pemberi Jasa
      {wch: 10}  // Durasi
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Posbakum');
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Rekap_Layanan_Posbakum_${date}.xlsx`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Filtering and Actions Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama, perkara, atau petugas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 bg-[#f8fafc] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
            <Filter size={16} /> Filter Data
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg text-[11px] font-black uppercase tracking-[0.15em] hover:bg-green-700 transition-all shadow-lg shadow-green-500/20"
          >
            <FileSpreadsheet size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hari / Tanggal</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identitas Pihak</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Klasifikasi Perkara</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Uraian Layanan</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Petugas / Durasi</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <p className="text-sm font-black text-slate-800">{report.day}</p>
                    <p className="text-[11px] font-bold text-blue-600 mt-1">{new Date(report.date).toLocaleDateString('id-ID')}</p>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-black border border-slate-200">
                        {report.parties[0]?.name.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">
                          {report.parties[0]?.name}
                          {report.parties.length > 1 && (
                            <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                              +{report.parties.length - 1}
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                          {report.parties[0]?.age} TAHUN • {report.parties[0]?.occupation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider border border-blue-100">
                      <Scale size={13} className="text-blue-400" /> {report.caseType}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700 line-clamp-1">{report.providedService}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 italic">REQ: {report.requestedService}</p>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <p className="text-sm font-black text-slate-700">{report.providerName}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-1 uppercase">
                      <Clock size={12} className="text-slate-300" /> {report.duration} MENIT
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(report.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-6 bg-slate-50 rounded-full border border-slate-100">
                        <FileSpreadsheet size={48} className="text-slate-200" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-400">Belum ada data laporan</p>
                        <p className="text-sm text-slate-300 uppercase tracking-widest mt-1">Silahkan input data melalui menu formulir</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {selectedReport && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedReport(null)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-[#1e40af] p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Rincian Laporan</h3>
                  <p className="text-blue-100 text-xs uppercase tracking-widest font-medium mt-1">ID: {selectedReport.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2 pb-2 border-b border-slate-100">
                    <User size={16} /> Identitas Para Pihak ({selectedReport.parties.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedReport.parties.map((party, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">
                            {idx + 1}
                          </div>
                          <p className="text-sm font-black text-slate-800">{party.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <DetailItem label="Jenis Kelamin" value={party.gender} />
                          <DetailItem label="Usia" value={`${party.age} Tahun`} />
                          <DetailItem label="Pekerjaan" value={party.occupation} className="col-span-2" />
                          <div className="col-span-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Alamat</p>
                            <p className="text-xs font-semibold text-slate-600 italic leading-relaxed">{party.address}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Section title="Detail Layanan" icon={<Scale size={16} />}>
                    <DetailItem label="Hari/Tanggal" value={`${selectedReport.day}, ${new Date(selectedReport.date).toLocaleDateString('id-ID')}`} />
                    <DetailItem label="Jenis Perkara" value={selectedReport.caseType} />
                    <DetailItem label="Jumlah Pemohon" value={`${selectedReport.serviceSeekersCount} Orang`} />
                    <DetailItem label="Layanan Dimohon" value={selectedReport.requestedService} />
                    <DetailItem label="Layanan Diberikan" value={selectedReport.providedService} />
                  </Section>

                  <Section title="Penyelesaian" icon={<Clock size={16} />}>
                    <DetailItem label="Petugas" value={selectedReport.providerName} />
                    <DetailItem label="Durasi" value={`${selectedReport.duration} Menit`} />
                  </Section>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button 
                   onClick={() => setSelectedReport(null)}
                   className="px-6 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                 >
                   Tutup
                 </button>
                 <button className="px-6 py-2 rounded-xl text-sm font-bold bg-[#1e40af] text-white hover:bg-blue-800 transition-colors shadow-sm">
                   Cetak Laporan
                 </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-[#1e40af] uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-100">
        {icon} {title}
      </h4>
      <div className="space-y-2.5">
        {children}
      </div>
    </div>
  );
}


function DetailItem({ label, value, className }: { label: string, value: string, className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
