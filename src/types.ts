export type Gender = 'Laki-laki' | 'Perempuan';

export interface PartyDetails {
  name: string;
  address: string;
  age: number;
  gender: Gender;
  occupation: string;
}

export interface DailyReport {
  id: string;
  date: string; // ISO format
  day: string; // Dynamic based on date
  parties: PartyDetails[];
  caseType: string;
  serviceSeekersCount: number;
  requestedService: string;
  providedService: string;
  providerName: string;
  duration: string;
  createdAt: string;
}

export const CASE_TYPES = [
  "Cerai Gugat",
  "Cerai Talak",
  "Dispensasi Nikah",
  "Itsbat Nikah",
  "Gugatan Itsbat Nikah",
  "Penetapan Ahli Waris",
  "Harta Bersama",
  "Perwalian",
  "Asal Usul Anak",
  "Replik",
  "Perubahan Gugatan/Permohonan",
  "Lain-lain"
];

export const PROVIDED_SERVICES = [
  "Surat Gugatan",
  "Surat Permohonan",
  "Konsultasi"
];

export const REQUESTED_SERVICES = [
  "Gugatan",
  "Permohonan",
  "Konsultasi"
];
