import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/UI';
import { Search, MapPin, Calendar, User, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

interface NIKData {
  nik: string;
  province: string;
  city: string;
  district: string;
  dob: string;
  gender: string;
  age: number;
}

export const NIKCheckerPage: React.FC = () => {
  const [nik, setNik] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NIKData | null>(null);

  const provinces: Record<string, string> = {
    "11": "Aceh", "12": "Sumatera Utara", "13": "Sumatera Barat", "14": "Riau", "15": "Jambi",
    "16": "Sumatera Selatan", "17": "Bengkulu", "18": "Lampung", "19": "Kepulauan Bangka Belitung",
    "21": "Kepulauan Riau", "31": "DKI Jakarta", "32": "Jawa Barat", "33": "Jawa Tengah",
    "34": "DI Yogyakarta", "35": "Jawa Timur", "36": "Banten", "51": "Bali", "52": "Nusa Tenggara Barat",
    "53": "Nusa Tenggara Timur", "61": "Kalimantan Barat", "62": "Kalimantan Tengah",
    "63": "Kalimantan Selatan", "64": "Kalimantan Timur", "65": "Kalimantan Utara",
    "71": "Sulawesi Utara", "72": "Sulawesi Tengah", "73": "Sulawesi Selatan",
    "74": "Sulawesi Tenggara", "75": "Gorontalo", "76": "Sulawesi Barat", "81": "Maluku",
    "82": "Maluku Utara", "91": "Papua Barat", "92": "Papua"
  };

  const handleCheck = () => {
    if (nik.length !== 16) {
      toast.error('NIK harus 16 digit');
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate API/Parser Logic
    setTimeout(() => {
      const provCode = nik.substring(0, 2);
      const dobCode = parseInt(nik.substring(6, 12));
      const sequence = nik.substring(12, 16);

      let day = parseInt(nik.substring(6, 8));
      const month = parseInt(nik.substring(8, 10));
      let year = parseInt(nik.substring(10, 12));
      
      let gender = "Laki-laki";
      if (day > 40) {
        gender = "Perempuan";
        day -= 40;
      }

      // Estimate year (simple logic, assuming 1900-2099)
      const currentYearShort = new Date().getFullYear() % 100;
      year += (year > currentYearShort ? 1900 : 2000);

      const dobDate = new Date(year, month - 1, day);
      const age = new Date().getFullYear() - year;

      if (isNaN(dobDate.getTime()) || month > 12 || day > 31) {
        toast.error('Format NIK tidak valid (Bit tanggal lahir salah)');
        setLoading(false);
        return;
      }

      setResult({
        nik,
        province: provinces[provCode] || "Provinsi Tidak Terdeteksi",
        city: "Data Kota/Kab (Kode: " + nik.substring(2, 4) + ")",
        district: "Data Kecamatan (Kode: " + nik.substring(4, 6) + ")",
        dob: dobDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        gender,
        age
      });

      setLoading(false);
      toast.success('NIK berhasil divalidasi!');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase">
          🔎 NIK <span className="text-brand-purple">CHECKER</span>
        </h2>
        <p className="text-slate-400 text-sm">Validasi data kartu tanda penduduk secara cepat & akurat.</p>
      </div>

      <Card className="p-8 border-white/5 bg-white/[0.02]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              label="Masukkan 16 Digit NIK"
              placeholder="Contoh: 3271012345678901"
              value={nik}
              onChange={(val) => setNik(val.replace(/\D/g, '').substring(0, 16))}
              icon={<Search className="w-5 h-5 text-brand-purple" />}
            />
          </div>
          <div className="md:pt-8">
            <Button 
              onClick={handleCheck} 
              loading={loading}
              className="w-full md:w-auto h-14"
            >
              PERIKSA DATA
            </Button>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card className="p-6 border-brand-purple/20 bg-brand-purple/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-purple/20 rounded-xl">
                  <User className="w-6 h-6 text-brand-purple" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Jenis Kelamin</p>
                  <p className="font-bold text-lg">{result.gender}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-purple/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-brand-purple" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Tanggal Lahir</p>
                  <p className="font-bold text-lg">{result.dob}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="premium">Umur: {result.age} Tahun</Badge>
              </div>
            </Card>

            <Card className="p-6 border-white/10 bg-white/[0.03] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-xl">
                  <MapPin className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Domisili Terdaftar</p>
                  <p className="font-bold text-base">{result.province}</p>
                  <p className="text-xs text-slate-400">{result.city}, {result.district}</p>
                </div>
              </div>
              
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  Data ini dihasilkan berdasarkan parsing algoritma NIK Dukcapil. Informasi nama dan alamat detail disembunyikan demi privasi.
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <Card className="p-10 border-dashed border-white/10 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
            <Info className="w-8 h-8 text-slate-600" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-400 uppercase tracking-tighter">Hasil Akan Muncul Di Sini</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">Sistem Kyzzyy akan membedah data geografis dan tanggal lahir dari NIK yang Anda masukkan.</p>
          </div>
        </Card>
      )}
    </div>
  );
};
