import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, RotateCcw, Star, CheckCircle } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { ScreenId } from '../types';

interface Screen6NilaiProps {
  starsCollected: number;
  onResetAll: () => void;
  onJumpToScreen: (screen: ScreenId) => void;
}

export const Screen6Nilai: React.FC<Screen6NilaiProps> = ({
  starsCollected,
  onResetAll,
  onJumpToScreen,
}) => {
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('simba_student_name') || 'Adik Arif';
  });
  const [schoolName, setSchoolName] = useState(() => {
    const savedClass = localStorage.getItem('simba_student_class');
    return savedClass ? `Kelas: ${savedClass}` : 'Program Pendidikan Khas Integrasi (PPKI)';
  });
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    sound.playWin();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (e) {}
  }, []);

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  const badges = [
    { title: 'Pakar Kenali', icon: '🔍', desc: 'Visual & maksud peribahasa' },
    { title: 'Bintang Sebutan', icon: '🗣️', desc: 'Lancar suku kata' },
    { title: 'Pakar Padanan', icon: '🧩', desc: 'Susun & padankan maksud' },
    { title: 'Kembara Simba', icon: '🎮', desc: 'Lompat & buka peribahasa' },
    { title: 'Pencerita Hebat', icon: '📖', desc: 'Kisah & bina ayat kebersihan' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 animate-fade-in space-y-6">
      {/* Clean Screen Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Modul 6 daripada 6 • Penilaian & Pengiktirafan
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Tahniah, Wira Kebersihan!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Anda telah menamatkan kesemua 6 modul pembelajaran peribahasa kebersihan dengan jayanya.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Sijil</span>
        </button>
      </div>

      {/* Clean Badges Row */}
      <div className="no-print bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Lencana Penguasaan Pembelajaran:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {badges.map((b, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center"
            >
              <div className="text-2xl mb-1">{b.icon}</div>
              <span className="font-bold text-xs text-slate-900">{b.title}</span>
              <span className="text-[10px] text-slate-500 leading-tight mt-0.5">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sijil Digital Rasmi (Printable Certificate) */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border-4 border-emerald-600 shadow-lg text-center space-y-6 relative">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase">
            Kementerian Pendidikan Malaysia • MBPK
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif pt-1">
            SIJIL PENGHARGAAN WIRA KEBERSIHAN
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Aplikasi Pembelajaran Peribahasa Interaktif (SIMBA)
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">Dengan ini diperakui bahawa:</p>

        {/* Student Name */}
        <div className="py-1">
          {isEditing ? (
            <div className="max-w-xs mx-auto space-y-2">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Nama Murid"
                className="w-full text-center text-xl font-bold p-2 border-2 border-emerald-500 rounded-xl"
              />
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Nama Kelas / Sekolah"
                className="w-full text-center text-xs p-1.5 border border-slate-300 rounded-xl"
              />
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs cursor-pointer"
              >
                Simpan Nama
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors inline-block group"
              title="Klik untuk menukar nama murid"
            >
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-900 border-b-2 border-emerald-300 pb-1 font-serif">
                {studentName}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">{schoolName}</p>
              <span className="no-print text-[10px] text-emerald-700 italic group-hover:underline block mt-0.5">
                (Klik untuk sunting nama)
              </span>
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
          Telah berjaya menyelesaikan kesemua 6 modul pembelajaran Peribahasa bertemakan "Jagalah Kebersihan" dengan jayanya, menunjukkan disiplin kerajinan yang tinggi, sebutan yang jelas, serta daya kefahaman bahasa yang membanggakan.
        </p>

        {/* Seal & Score */}
        <div className="flex items-center justify-around pt-4 border-t border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 block">Bintang Diperoleh</span>
            <span className="font-extrabold text-base text-amber-600 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{starsCollected} Bintang</span>
            </span>
          </div>

          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-600 flex flex-col items-center justify-center text-emerald-900 shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Wira MBPK</span>
          </div>
        </div>
      </div>

      {/* Clean Bottom Actions */}
      <div className="no-print flex items-center justify-between pt-2">
        <button
          onClick={onResetAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mula Semula Semua Modul</span>
        </button>

        <button
          onClick={() => onJumpToScreen(1)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm cursor-pointer"
        >
          <span>Ulang Kaji Semula dari Skrin 1</span>
        </button>
      </div>
    </div>
  );
};
