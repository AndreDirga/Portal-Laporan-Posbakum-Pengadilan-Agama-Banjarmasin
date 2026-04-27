import { useState, type ChangeEvent, type FormEvent } from 'react';
import { DailyReport, Gender, CASE_TYPES, PROVIDED_SERVICES, REQUESTED_SERVICES, PartyDetails } from '../types';
import { 
  Save, 
  RotateCcw, 
  User, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Scale, 
  Clock,
  Heart,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ReportFormProps {
  onSubmit: (report: DailyReport) => void;
}

export default function ReportForm({ onSubmit }: ReportFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    parties: [{
      name: '',
      address: '',
      age: '',
      gender: 'Laki-laki' as Gender,
      occupation: '',
    }],
    caseType: CASE_TYPES[0],
    serviceSeekersCount: '1',
    requestedService: REQUESTED_SERVICES[0],
    providedService: PROVIDED_SERVICES[0],
    providerName: '',
    duration: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'serviceSeekersCount') {
      const count = Math.max(1, parseInt(value) || 1);
      setFormData(prev => {
        const newParties = [...prev.parties];
        if (count > newParties.length) {
          // Add new party slots
          for (let i = newParties.length; i < count; i++) {
            newParties.push({
              name: '',
              address: '',
              age: '',
              gender: 'Laki-laki',
              occupation: '',
            });
          }
        } else if (count < newParties.length) {
          // Remove extra slots
          newParties.splice(count);
        }
        return { ...prev, serviceSeekersCount: value, parties: newParties };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePartyChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newParties = [...prev.parties];
      newParties[index] = { ...newParties[index], [name]: value };
      return { ...prev, parties: newParties };
    });
  };

  const handleGenderChange = (index: number, gender: Gender) => {
    setFormData(prev => {
      const newParties = [...prev.parties];
      newParties[index] = { ...newParties[index], gender };
      return { ...prev, parties: newParties };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const newReport: DailyReport = {
      id: Math.random().toString(36).substr(2, 9),
      date: formData.date,
      parties: formData.parties.map(p => ({
        ...p,
        age: Number(p.age)
      })) as PartyDetails[],
      caseType: formData.caseType,
      serviceSeekersCount: Number(formData.serviceSeekersCount),
      requestedService: formData.requestedService,
      providedService: formData.providedService,
      providerName: formData.providerName,
      duration: formData.duration,
      day: format(new Date(formData.date), 'EEEE', { locale: id }),
      createdAt: new Date().toISOString()
    };

    onSubmit(newReport);
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 flex">
           <div 
             className="h-full bg-[#1e40af] transition-all duration-500 ease-out" 
             style={{ width: `${(step / 3) * 100}%` }}
           />
        </div>

        <div className="p-8">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-[#1e40af] uppercase tracking-widest mb-1 italic">Langkah {step} dari 3</p>
              <h2 className="text-2xl font-bold text-slate-800">
                {step === 1 ? 'Data Identitas Pihak' : step === 2 ? 'Detail Perkara' : 'Informasi Layanan'}
              </h2>
            </div>
            <div className="flex gap-2">
               {[1, 2, 3].map(i => (
                 <div key={i} className={cn(
                   "w-2.5 h-2.5 rounded-full transition-colors duration-300",
                   step === i ? "bg-[#1e40af]" : "bg-slate-200"
                 )} />
               ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="space-y-2 max-w-xs">
                    <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">
                      1. Hari / Tanggal
                    </label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  {formData.parties.map((party, index) => (
                    <div key={index} className="space-y-6 p-6 border-l-4 border-blue-600 bg-white shadow-sm rounded-r-xl relative group/party">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                            {index + 1}
                          </div>
                          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Identitas Pihak ke-{index + 1}</h3>
                        </div>
                        
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newParties = [...formData.parties];
                              newParties.splice(index, 1);
                              setFormData(prev => ({ 
                                ...prev, 
                                parties: newParties,
                                serviceSeekersCount: newParties.length.toString()
                              }));
                            }}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus Pihak"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">
                            Nama Lengkap Pihak
                          </label>
                          <input 
                            type="text" 
                            name="name"
                            placeholder="Sesuai KTP"
                            value={party.name}
                            onChange={(e) => handlePartyChange(index, e)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-[#f8fafc] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">
                            Usia Pihak
                          </label>
                          <div className="relative">
                            <input 
                              type="number" 
                              name="age"
                              placeholder="35"
                              value={party.age}
                              onChange={(e) => handlePartyChange(index, e)}
                              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-[#f8fafc] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                              required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun</span>
                          </div>
                        </div>

                        <div className="col-span-2 space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">
                            Alamat Lengkap
                          </label>
                          <textarea 
                            name="address"
                            placeholder="Kecamatan, Kabupaten/Kota..."
                            value={party.address}
                            onChange={(e) => handlePartyChange(index, e)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-[#f8fafc] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 min-h-[80px]" 
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">Pekerjaan</label>
                          <input 
                            type="text" 
                            name="occupation"
                            placeholder="Wiraswasta / Pegawai..."
                            value={party.occupation}
                            onChange={(e) => handlePartyChange(index, e)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-[#f8fafc] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">Jenis Kelamin</label>
                          <div className="flex gap-4">
                            {(['Laki-laki', 'Perempuan'] as Gender[]).map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => handleGenderChange(index, g)}
                                className={cn(
                                  "flex-1 py-3 rounded-lg border-2 transition-all text-[11px] font-black uppercase tracking-widest shadow-sm",
                                  party.gender === g 
                                    ? "bg-blue-600 border-blue-600 text-white" 
                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                )}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => {
                        const newParties = [...prev.parties, {
                          name: '',
                          address: '',
                          age: '',
                          gender: 'Laki-laki',
                          occupation: '',
                        }];
                        return { 
                          ...prev, 
                          parties: newParties,
                          serviceSeekersCount: newParties.length.toString()
                        };
                      });
                    }}
                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Tambah Registrasi Pihak Lainnya
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">7. Jenis Perkara</label>
                  <select 
                    name="caseType"
                    value={formData.caseType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-[#f8fafc] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                    required
                  >
                    {CASE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">8. Jumlah Pemohon Layanan</label>
                  <input 
                    type="number" 
                    name="serviceSeekersCount"
                    value={formData.serviceSeekersCount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-[#f8fafc] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                    required
                    min="1"
                  />
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-2 bg-blue-50 px-3 py-1 rounded inline-block">
                    *Input rincian identitas akan disesuaikan otomatis
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">9. Layanan yang Dimohon</label>
                  <select 
                    name="requestedService"
                    value={formData.requestedService}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-[#f8fafc] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                    required
                  >
                    {REQUESTED_SERVICES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">10. Layanan yang Diberikan</label>
                  <select 
                    name="providedService"
                    value={formData.providedService}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-[#f8fafc] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                    required
                  >
                    {PROVIDED_SERVICES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">11. Nama Pemberi Jasa</label>
                  <input 
                    type="text" 
                    name="providerName"
                    placeholder="Advokat..."
                    value={formData.providerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-[#f8fafc] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1 block">12. Durasi Pengerjaan</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="duration"
                      placeholder="25"
                      value={formData.duration}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val > 25) {
                          e.target.value = '25';
                        }
                        handleChange(e);
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-[#f8fafc] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                      required
                      min="1"
                      max="25"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Menit</span>
                  </div>
                  <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                    * Maksimal durasi pengerjaan adalah 25 menit
                  </p>
                </div>
              </div>
            )}

            <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={step === 1 ? () => {} : prevStep}
                className={cn(
                  "flex items-center gap-2 px-8 py-3 rounded-lg font-black transition-all text-[11px] uppercase tracking-widest",
                  step === 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                )}
                disabled={step === 1}
              >
                <ChevronLeft size={18} /> Kembali
              </button>
              
              <div className="flex gap-4 items-center">
                <button
                  type="button"
                  onClick={() => setFormData({
                    date: format(new Date(), 'yyyy-MM-dd'),
                    parties: [{
                      name: '',
                      address: '',
                      age: '',
                      gender: 'Laki-laki',
                      occupation: '',
                    }],
                    caseType: CASE_TYPES[0],
                    serviceSeekersCount: '1',
                    requestedService: REQUESTED_SERVICES[0],
                    providedService: PROVIDED_SERVICES[0],
                    providerName: '',
                    duration: ''
                  })}
                  className="text-slate-400 hover:text-red-500 transition-all"
                  title="Reset Formulir"
                >
                  <RotateCcw size={20} />
                </button>
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-lg font-black shadow-lg shadow-blue-500/30 transition-all text-[11px] uppercase tracking-[0.2em]"
                  >
                    Lanjut <ChevronRight size={18} className="ml-1 inline" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-lg font-black shadow-xl shadow-blue-500/40 transition-all text-[12px] uppercase tracking-[0.2em]"
                  >
                    Simpan Laporan <Save size={18} className="ml-2 inline" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-4 text-slate-400">
         <div className="h-[1px] flex-1 bg-slate-200"></div>
         <p className="text-[10px] font-bold uppercase tracking-widest italic">PA Banjarmasin Kelas IA</p>
         <div className="h-[1px] flex-1 bg-slate-200"></div>
      </div>
    </div>
  );
}
