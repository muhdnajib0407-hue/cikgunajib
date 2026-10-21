import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  FileText,
  Printer,
  CheckCircle2,
  BookOpen,
  Award,
  Users,
  Lightbulb,
} from 'lucide-react';
import { CORE_5_IDIOMS, SIMPULAN_BAHASA_LIST } from '../data/simpulanBahasaData';
import { sound } from '../utils/soundEffects';

interface DashboardGuruModalProps {
  isOpen: boolean;
  onClose: () => void;
  starsCollected: number;
}

export const DashboardGuruModal: React.FC<DashboardGuruModalProps> = ({
  isOpen,
  onClose,
  starsCollected,
}) => {
  const [activeTab, setActiveTab] = useState<'panduan' | 'dskp' | 'lembaran'>('panduan');

  if (!isOpen) return null;

  const handlePrintWorksheet = () => {
    sound.playPop();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border-2 border-indigo-300 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-700 to-purple-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              👨‍🏫
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight font-serif">
                Dashboard Guru & Ibu Bapa
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 font-medium">
                Panduan PdP Simpulan Bahasa MBPK (Pendidikan Khas & Pemulihan)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Tutup Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-indigo-100 bg-indigo-50/60 p-2 gap-2 text-xs sm:text-sm font-bold">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('panduan');
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'panduan'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Panduan Penggunaan PdP</span>
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('dskp');
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'dskp'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Penjajaran DSKP & Objektif</span>
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('lembaran');
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'lembaran'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Lembaran Kerja Cetak</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'panduan' && (
            <div className="space-y-5">
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200">
                <h3 className="font-extrabold text-indigo-950 text-base mb-1">
                  🎯 Pengenalan Aplikasi SIMBA
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Aplikasi <strong>SIMBA</strong> dirancang berlandaskan pendekatan <em>Universal Design for Learning (UDL)</em> dan pendekatan multisensori (VARK: Visual, Auditori, Kinestetik) khusus untuk Murid Berkeperluan Pendidikan Khas (MBPK) yang menghadapi Masalah Pembelajaran, Disleksia, Autisme, ADHD, dan murid Pemulihan Khas.
                </p>
              </div>

              {/* Step-by-Step 6 Screen Teaching Guide */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Aliran Pelaksanaan 6 Modul Dalam Bilik Darjah:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                    <span className="font-bold text-amber-900 block">
                      1. Skrin 1 (Kenali) - Penstrukturan Konsep
                    </span>
                    <p className="text-slate-600">
                      Bantu murid membezakan antara <strong>maksud harfiah</strong> dan <strong>maksud kiasan</strong>. Murid autisme cenderung memahami peribahasa secara harfiah. Visual komik membantu kefahaman metafora.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                    <span className="font-bold text-blue-900 block">
                      2. Skrin 2 (Sebut) - Terapi Pertuturan & Fonologi
                    </span>
                    <p className="text-slate-600">
                      Gunakan pecahan kad suku kata berwarna untuk melatih sebutan dan artikulasi mulut murid secara berperingkat dengan tempo perlahan.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-900 block">
                      3. Skrin 3 (Padankan) - Susun Perkataan & Padan Maksud
                    </span>
                    <p className="text-slate-600">
                      Aktiviti menyusun 2 perkataan simpulan bahasa berbantukan gambar kartun jelas, dengan pilihan Mod Bimbingan MBPK (1 perkataan disediakan) dan pemadanan kad maksud kiasan.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                    <span className="font-bold text-sky-900 block">
                      4. Skrin 4 (Kembara Simba) - Gamifikasi Kognitif
                    </span>
                    <p className="text-slate-600">
                      Permainan aksi kembara Simba mengutip sampah dan melompat membuka kotak misteri merangsang penglibatan aktif murid untuk mengeluarkan peribahasa kebersihan dengan penuh keseronokan.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                    <span className="font-bold text-purple-900 block">
                      5. Skrin 5 (Bercerita) - Kisah Kebersihan & Bina Ayat
                    </span>
                    <p className="text-slate-600">
                      Kisah teladan "Misi Jagalah Kebersihan Taman Ceria" memperkaya literasi dan kosa kata sebelum murid menyusun ayat amalan kebersihan berbantukan blok perkataan.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                    <span className="font-bold text-rose-900 block">
                      6. Skrin 6 (Nilai) - Pengukuhan Positif & Sijil Wira Kebersihan
                    </span>
                    <p className="text-slate-600">
                      Ganjaran lencana dan sijil digital mencetuskan rasa bangga kendiri (self-esteem) yang sangat bernilai bagi pembangunan emosi murid MBPK.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dskp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Standard Kurikulum Pendidikan Khas (DSKP KSSR PK Bahasa Melayu):
                </h3>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-700 space-y-1.5">
                  <li>
                    <strong>Tema Sivik & Nilai Murni:</strong> Bertanggungjawab Menjaga Kebersihan Diri dan Persekitaran serta Amalan Kerajinan.
                  </li>
                  <li>
                    <strong>Standard Kandungan 1.2:</strong> Mendengar, memahami dan menyebut perkataan dan simpulan bahasa mudah mengikut sebutan yang betul.
                  </li>
                  <li>
                    <strong>Standard Pembelajaran 1.2.3:</strong> Menyebut simpulan bahasa secara bertatasusila dengan bimbingan audio.
                  </li>
                  <li>
                    <strong>Standard Kandungan 2.1:</strong> Membaca dan memahami kosa kata umum dan simpulan bahasa dalam konteks kebersihan harian.
                  </li>
                  <li>
                    <strong>Standard Pembelajaran 3.2.1:</strong> Membina dan menulis ayat mudah menggunakan simpulan bahasa dengan bantuan perkataan sokongan.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Ciri-Ciri Sokongan Khas Disleksia (MBPK):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-950">
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/80">
                    <strong>1. Fon Lexend & OpenDyslexic:</strong> Fon tapak berat dan berjarak luas yang mengurangkan kekeliruan bentuk huruf.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/80">
                    <strong>2. Pembaris Bacaan Garis (Irlen Tint):</strong> Pembaris berpenapis warna (kuning, biru, hijau) yang mengurangkan silau dan fenomena perkataan 'terapung'.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/80">
                    <strong>3. Suku Kata Berwarna:</strong> Pemecahan visual dwitona bagi membantu murid menyahkod (decoding) fonem secara berperingkat.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/80">
                    <strong>4. Panduan Huruf Cermin (b, d, p, q):</strong> Mnemonik visual tangan & latihan mini untuk mengatasi masalah pembalikan huruf.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 sm:col-span-2">
                    <strong>5. Suara Perlahan (🐢 0.7x) & Sorotan Ayat:</strong> Bacaan berperingkat satu demi satu baris dalam modul cerita untuk mengekalkan fokus murid.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lembaran' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Lembaran Aktiviti Pengukuhan (Bilik Darjah)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cetak helaian ini untuk aktiviti penulisan pensel & kertas murid.
                  </p>
                </div>
                <button
                  onClick={handlePrintWorksheet}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Lembaran</span>
                </button>
              </div>

              {/* Printable Worksheet Preview Container */}
              <div className="p-6 bg-white border-2 border-dashed border-slate-300 rounded-3xl space-y-6 text-slate-900">
                <div className="text-center border-b-2 border-slate-300 pb-4 space-y-1">
                  <h4 className="font-black text-lg">
                    LEMBARAN KERJA BAHASA MELAYU PENDIDIKAN KHAS
                  </h4>
                  <p className="text-xs text-slate-600 font-bold uppercase">
                    Tema: Jagalah Kebersihan & Kerajinan (Ringan Tulang, Mandi Peluh, Berganding Bahu, Lipas Kudung, Berat Tulang)
                  </p>
                  <div className="flex justify-between pt-3 text-xs font-semibold text-slate-700">
                    <span>Nama Murid: ___________________________</span>
                    <span>Kelas: ______________</span>
                    <span>Tarikh: ____________</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <p className="font-bold text-slate-800">
                    Aktiviti: Padankan peribahasa berikut dengan maksud amalan kebersihan yang betul dan bina ayat mudah.
                  </p>

                  <div className="space-y-3">
                    {CORE_5_IDIOMS.map((idiom, idx) => (
                      <div
                        key={idiom.id}
                        className="p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <span>{idx + 1}.</span>
                          <span>{idiom.phrase}</span>
                        </div>
                        <div className="w-full sm:w-1/2 border-b border-dotted border-slate-400 py-1 text-slate-400 text-xs">
                          ( Tulis maksud di sini: __________________ )
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <p className="font-bold text-slate-800">
                      Bina satu ayat mudah berkaitan amalan kebersihan menggunakan "Ringan Tulang":
                    </p>
                    <div className="w-full border-b-2 border-dotted border-slate-400 h-8" />
                    <div className="w-full border-b-2 border-dotted border-slate-400 h-8" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm"
          >
            Tutup Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
