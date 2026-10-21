import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, ArrowRight, User, School, Heart, CheckCircle2, BookOpen, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/soundEffects';
import { speech } from '../utils/speech';
import { CORE_5_IDIOMS } from '../data/simpulanBahasaData';
import { StudentProfile } from '../types';

interface Screen0LamanUtamaProps {
  onStartActivity: () => void;
  showSyllables?: boolean;
}

const AVATAR_OPTIONS = [
  { id: 'simba', emoji: '🦁', name: 'Simba Cilik' },
  { id: 'cat', emoji: '🐱', name: 'Si Comel' },
  { id: 'rabbit', emoji: '🐰', name: 'Arnab Pantas' },
  { id: 'panda', emoji: '🐼', name: 'Panda Rajin' },
  { id: 'bear', emoji: '🐻', name: 'Beruang Gigih' },
];

const QUICK_CLASSES = ['PPKI Ceria', '3 Arif', '3 Bijak', '4 Gemilang', 'Pendidikan Khas'];

export const Screen0LamanUtama: React.FC<Screen0LamanUtamaProps> = ({
  onStartActivity,
  showSyllables = false,
}) => {
  const [name, setName] = useState<string>(() => {
    return localStorage.getItem('simba_student_name') || '';
  });

  const [className, setClassName] = useState<string>(() => {
    return localStorage.getItem('simba_student_class') || '3 Arif';
  });

  const [selectedAvatar, setSelectedAvatar] = useState<string>(() => {
    return localStorage.getItem('simba_student_avatar') || 'simba';
  });

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [inputError, setInputError] = useState('');

  // Welcome banner image
  const welcomeBannerUrl = '/src/assets/images/selamat_datang_simba_1792503453556.jpg';

  const teacherMessage = 'Hari ini cikgu nak kamu faham tentang simpulan bahasa dan maknanya.';
  const teacherMessageSyllables = 'Ha-ri i-ni cik-gu nak ka-mu fa-ham ten-tang sim-pu-lan ba-ha-sa dan mak-na-nya.';

  const handlePlayTeacherVoice = () => {
    sound.playPop();
    setIsPlayingAudio(true);
    const fullSpeech = `Selamat Datang Murid-Murid! Tema utama kita ialah Jagalah kebersihan dan kerajinan. Hari ini cikgu nak kamu faham tentang simpulan bahasa dan maknanya. Masukkan nama dan kelas kamu, kemudian tekan butang Jom Ke Aktiviti Seterusnya!`;
    speech.speak(fullSpeech, {
      onEnd: () => {
        setIsPlayingAudio(false);
      },
    });
  };

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const finalName = name.trim() || 'Murid Hebat';
    const finalClass = className.trim() || 'PPKI Ceria';

    // Save to local storage for global persistence
    localStorage.setItem('simba_student_name', finalName);
    localStorage.setItem('simba_student_class', finalClass);
    localStorage.setItem('simba_student_avatar', selectedAvatar);

    sound.playWin();
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (_) {}

    speech.speak(`Bagus, ${finalName}! Jom kita mulakan aktiviti pertama!`);
    onStartActivity();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border-3 border-emerald-400 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white">
        <div className="relative w-full aspect-21/9 sm:aspect-16/7 max-h-[380px] overflow-hidden bg-slate-900">
          <img
            src={welcomeBannerUrl}
            alt="Selamat Datang Murid-Murid ke Kelas Simba"
            className="w-full h-full object-cover object-center filter brightness-95 transform hover:scale-102 transition-transform duration-700"
          />
          {/* Subtle gradient overlay to enhance readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-4 sm:p-8">
            <div className="inline-flex items-center gap-2 self-start bg-emerald-500/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md mb-2 border border-emerald-200/50">
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
              <span>Tema Utama: Jagalah Kebersihan dan Kerajinan</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight font-serif">
              Selamat Datang Murid-Murid! 🌟
            </h1>
            <p className="text-emerald-100 text-xs sm:text-base font-medium max-w-2xl mt-1 drop-shadow">
              Mari kita belajar, bermain permainan interaktif, dan kumpul bintang kejuaraan bersama maskot Simba!
            </p>
          </div>
        </div>
      </div>

      {/* Teacher's Voice & Message Card */}
      <div className="bg-amber-50/90 rounded-3xl p-5 sm:p-7 border-2 border-amber-300/80 shadow-md flex flex-col md:flex-row items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-4xl sm:text-5xl shadow-md border-3 border-white">
            👩‍🏫
          </div>
          <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            Cikgu
          </span>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-lg uppercase tracking-wide">
              Pesanan Khas Cikgu Hari Ini
            </span>
            <button
              onClick={handlePlayTeacherVoice}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-all ${
                isPlayingAudio
                  ? 'bg-amber-600 text-white ring-2 ring-amber-300 scale-105'
                  : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-white' : 'text-amber-700'}`} />
              <span>{isPlayingAudio ? 'Sedang Bercakap...' : '🔊 Dengar Suara Cikgu'}</span>
            </button>
          </div>

          <p className="text-lg sm:text-2xl font-black text-slate-800 leading-snug font-serif">
            "{showSyllables ? teacherMessageSyllables : teacherMessage}"
          </p>

          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Di dalam aplikasi ini, kamu akan mengenali peribahasa, membunyikan suku kata, bermain teka teki buah, dan membaca cerita menarik!
          </p>
        </div>
      </div>

      {/* Main Form: Student Name & Class (Bahagian isi nama pelajar dan kelas) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-lg space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-600" />
              <span>Isi Maklumat Pelajar</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tulis nama dan kelas kamu untuk dicatat pada papan markah dan Sijil Wira Kebersihan!
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
            Langkah 1 • Pendaftaran Murid
          </span>
        </div>

        <form onSubmit={handleStart} className="space-y-6">
          {/* Avatar Selector */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              Pilih Maskot Kegemaran Kamu:
            </label>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setSelectedAvatar(av.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                    selectedAvatar === av.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200 scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{av.emoji}</span>
                  <span>{av.name}</span>
                  {selectedAvatar === av.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Input Nama Pelajar */}
            <div className="space-y-2">
              <label htmlFor="student-name-input" className="block text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>Nama Pelajar:</span>
                  <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-500">Nama panggilan kamu</span>
              </label>
              <div className="relative">
                <input
                  id="student-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (inputError) setInputError('');
                  }}
                  placeholder="Contoh: Amir / Sarah / Danish"
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 text-base sm:text-lg font-bold text-slate-800 transition-all outline-none bg-slate-50 focus:bg-white"
                />
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Input Kelas */}
            <div className="space-y-2">
              <label htmlFor="student-class-input" className="block text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>Kelas Pelajar:</span>
                  <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-500">Pilih atau taip kelas</span>
              </label>
              <div className="relative">
                <input
                  id="student-class-input"
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: 3 Arif / PPKI Ceria"
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 text-base sm:text-lg font-bold text-slate-800 transition-all outline-none bg-slate-50 focus:bg-white"
                />
                <School className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Quick Class Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 font-semibold mr-1">Cadangan:</span>
                {QUICK_CLASSES.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setClassName(cls);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                      className === cls
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button: Jom Ke Aktiviti Seterusnya */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✓
              </span>
              <span>Aktiviti seterusnya: <strong>Muka 1 • Kenali Peribahasa</strong></span>
            </div>

            <button
              type="submit"
              onClick={handleStart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 transition-all cursor-pointer group"
            >
              <span>Jom Ke Aktiviti Seterusnya</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section: 5 Peribahasa Utama Hari Ini */}
      <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-serif">
              Peribahasa Kebersihan & Kerajinan Yang Akan Dipelajari:
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">5 Simpulan Bahasa</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {CORE_5_IDIOMS.map((idiom, idx) => (
            <div
              key={idiom.id}
              className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 group-hover:scale-105 transition-transform">
                {idiom.imageUrl ? (
                  <img
                    src={idiom.imageUrl}
                    alt={idiom.phrase}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    {idiom.emoji}
                  </div>
                )}
              </div>
              <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700">
                {idx + 1}. {idiom.phrase}
              </span>
              <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                {idiom.figurativeMeaning}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
