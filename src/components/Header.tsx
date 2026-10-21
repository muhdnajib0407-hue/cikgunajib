import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  GraduationCap,
  Sliders,
  Check,
  Type,
  Eye,
} from 'lucide-react';
import { ScreenId, ThemeMode, TextSizeMode, FontMode, LetterSpacingMode } from '../types';
import { sound } from '../utils/soundEffects';

interface HeaderProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  starsCollected: number;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  textSize: TextSizeMode;
  onTextSizeChange: (size: TextSizeMode) => void;
  fontMode: FontMode;
  onFontModeChange: (font: FontMode) => void;
  showSyllables: boolean;
  onToggleSyllables: () => void;
  isDyslexiaMode: boolean;
  onToggleDyslexiaMode: () => void;
  isReadingRulerActive: boolean;
  onToggleReadingRuler: () => void;
  letterSpacing: LetterSpacingMode;
  onLetterSpacingChange: (spacing: LetterSpacingMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenDictionary: () => void;
  onOpenTeacherDashboard: () => void;
  onOpenLetterConfusionModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  starsCollected,
  theme,
  onThemeChange,
  textSize,
  onTextSizeChange,
  fontMode,
  onFontModeChange,
  showSyllables,
  onToggleSyllables,
  isDyslexiaMode,
  onToggleDyslexiaMode,
  isReadingRulerActive,
  onToggleReadingRuler,
  letterSpacing,
  onLetterSpacingChange,
  isMuted,
  onToggleMute,
  onOpenDictionary,
  onOpenTeacherDashboard,
  onOpenLetterConfusionModal,
}) => {
  const [showAccessMenu, setShowAccessMenu] = useState(false);

  const screens: { id: ScreenId; label: string; icon: string }[] = [
    { id: 0, label: 'Laman Utama', icon: '🏠' },
    { id: 1, label: 'Kenali', icon: '🔍' },
    { id: 2, label: 'Sebut', icon: '🗣️' },
    { id: 3, label: 'Padankan', icon: '🧩' },
    { id: 4, label: 'Kembara Simba', icon: '🎮' },
    { id: 5, label: 'Bercerita', icon: '📖' },
    { id: 6, label: 'Nilai', icon: '🏆' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Clean Branding */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => onSelectScreen(0)}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
              🦁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-serif">
                  SIMBA
                </span>
                <span className="text-slate-300 font-light">|</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-800">
                  Jagalah Kebersihan
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Peribahasa Interaktif Murid Berkeperluan Khas (MBPK)
              </p>
            </div>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Dyslexia Master Toggle Button */}
            <button
              onClick={onToggleDyslexiaMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-xs ${
                isDyslexiaMode
                  ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Aktifkan pakej sokongan mesra disleksia (Suku kata, fon Lexend, pembaris bacaan & anti-silau)"
            >
              <span>📖</span>
              <span className="hidden sm:inline">Mod Disleksia</span>
              {isDyslexiaMode && <Check className="w-3.5 h-3.5 text-amber-700" />}
            </button>

            {/* Quick Syllables Toggle */}
            <button
              onClick={onToggleSyllables}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-xs ${
                showSyllables
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title="Pecah Suku Kata Berwarna"
            >
              <span>🔤</span>
              <span className="hidden md:inline">Suku Kata</span>
              {showSyllables && <span className="text-[10px] text-emerald-700">✓</span>}
            </button>

            {/* Stars Counter */}
            <div
              className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1.5 rounded-xl text-amber-900 font-bold text-xs sm:text-sm shadow-xs"
              title="Bintang Terkumpul"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{starsCollected}</span>
            </div>

            {/* Quick Huruf b-d-p-q Guide Button */}
            <button
              onClick={() => {
                sound.playPop();
                onOpenLetterConfusionModal();
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-colors cursor-pointer shadow-xs"
              title="Panduan Membezakan Huruf Cermin (b, d, p, q)"
            >
              <span>💡</span>
              <span className="hidden xl:inline">Huruf b/d/p/q</span>
            </button>

            {/* Kamus */}
            <button
              onClick={() => {
                sound.playPop();
                onOpenDictionary();
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 border border-slate-200 transition-colors cursor-pointer"
              title="Buka Kamus 20 Peribahasa"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">Kamus</span>
            </button>

            {/* Dashboard Guru */}
            <button
              onClick={() => {
                sound.playPop();
                onOpenTeacherDashboard();
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-800 hover:bg-indigo-50/80 border border-slate-200 transition-colors cursor-pointer"
              title="Panduan Guru & DSKP"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden lg:inline">Guru</span>
            </button>

            {/* Accessibility Settings Toggle */}
            <button
              onClick={() => {
                sound.playPop();
                setShowAccessMenu(!showAccessMenu);
              }}
              className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                showAccessMenu
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
              title="Tetapan Aksesibiliti & Disleksia"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Tetapan</span>
            </button>

            {/* Audio Mute */}
            <button
              onClick={() => {
                onToggleMute();
                sound.playPop();
              }}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title={isMuted ? 'Buka Bunyi' : 'Bisu Audio'}
              aria-label={isMuted ? 'Buka Bunyi' : 'Bisu Audio'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Clean, Segmented Screen Navigation */}
        <nav className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          {screens.map((s) => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  sound.playPop();
                  onSelectScreen(s.id);
                }}
                className={`flex-1 min-w-[65px] sm:min-w-[95px] py-1 px-2 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <span>{s.icon}</span>
                <span className="whitespace-nowrap">
                  {s.id === 0 ? s.label : `${s.id}. ${s.label}`}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Organized Accessibility & Dyslexia Drawer */}
        {showAccessMenu && (
          <div className="mt-2.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-md text-slate-800 animate-fade-in text-xs sm:text-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                <span>📖</span>
                <span>Peralatan Khas Disleksia & Aksesibiliti MBPK</span>
              </span>
              <button
                onClick={() => setShowAccessMenu(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-0.5 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                Tutup ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 1. Fon Mesra Disleksia */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                  <Type className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fon Mesra Disleksia:</span>
                </label>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      sound.playPop();
                      onFontModeChange('lexend');
                    }}
                    className={`py-1 px-2 rounded-lg border text-xs text-left cursor-pointer transition-colors ${
                      fontMode === 'lexend'
                        ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    ⭐ Lexend (Piawaian Disleksia)
                  </button>
                  <button
                    onClick={() => {
                      sound.playPop();
                      onFontModeChange('opendyslexic');
                    }}
                    className={`py-1 px-2 rounded-lg border text-xs text-left cursor-pointer transition-colors font-opendyslexic ${
                      fontMode === 'opendyslexic'
                        ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    📖 OpenDyslexic (Tapak Berat)
                  </button>
                  <button
                    onClick={() => {
                      sound.playPop();
                      onFontModeChange('comic');
                    }}
                    className={`py-1 px-2 rounded-lg border text-xs text-left cursor-pointer transition-colors font-comic ${
                      fontMode === 'comic'
                        ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    😊 Comic Ceria
                  </button>
                  <button
                    onClick={() => {
                      sound.playPop();
                      onFontModeChange('sans');
                    }}
                    className={`py-1 px-2 rounded-lg border text-xs text-left cursor-pointer transition-colors ${
                      fontMode === 'sans'
                        ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🔤 Sistem Ringkas
                  </button>
                </div>
              </div>

              {/* 2. Pembaris Bacaan & Jarak Huruf */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Panduan Membaca Baris:</span>
                </label>

                {/* Pembaris Bacaan Toggle */}
                <button
                  onClick={() => {
                    sound.playPop();
                    onToggleReadingRuler();
                  }}
                  className={`w-full py-1.5 px-2 rounded-lg border text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    isReadingRulerActive
                      ? 'bg-amber-100 border-amber-500 text-amber-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>📏 Pembaris Bacaan</span>
                  <span>{isReadingRulerActive ? 'AKTIF' : 'PADAM'}</span>
                </button>

                {/* Jarak Huruf */}
                <button
                  onClick={() => {
                    sound.playPop();
                    onLetterSpacingChange(letterSpacing === 'wide' ? 'normal' : 'wide');
                  }}
                  className={`w-full py-1.5 px-2 rounded-lg border text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    letterSpacing === 'wide'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>↔️ Jarak Huruf Luas</span>
                  <span>{letterSpacing === 'wide' ? 'LUAS' : 'BIASA'}</span>
                </button>
              </div>

              {/* 3. Warna Latar Anti-Silau (Irlen / Dyslexia Tint) */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-800 block text-xs">
                  Warna Latar Pelindung Silau:
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => onThemeChange('krim')}
                    className={`px-2 py-1 rounded-lg border text-xs cursor-pointer ${
                      theme === 'krim'
                        ? 'border-emerald-600 bg-amber-50 font-bold text-emerald-950'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    Krim Lembut
                  </button>
                  <button
                    onClick={() => onThemeChange('hijau')}
                    className={`px-2 py-1 rounded-lg border text-xs cursor-pointer ${
                      theme === 'hijau'
                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    Hijau Alam
                  </button>
                  <button
                    onClick={() => onThemeChange('biru')}
                    className={`px-2 py-1 rounded-lg border text-xs cursor-pointer ${
                      theme === 'biru'
                        ? 'border-emerald-600 bg-blue-50 font-bold text-emerald-950'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    Biru Tenang
                  </button>
                  <button
                    onClick={() => onThemeChange('kontras')}
                    className={`px-2 py-1 rounded-lg border text-xs cursor-pointer ${
                      theme === 'kontras'
                        ? 'border-yellow-400 bg-black text-yellow-300 font-bold'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    Kontras Tinggi
                  </button>
                </div>
              </div>

              {/* 4. Saiz Fon Tulisan */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-800 block text-xs">
                  Saiz Tulisan:
                </label>
                <div className="flex flex-col gap-1">
                  {(['normal', 'large', 'xlarge'] as TextSizeMode[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => onTextSizeChange(size)}
                      className={`py-1 px-2 rounded-lg border text-xs text-left cursor-pointer ${
                        textSize === size
                          ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      {size === 'normal'
                        ? 'Biasa (Kanak-kanak)'
                        : size === 'large'
                        ? 'Besar (Disleksia)'
                        : 'Sangat Besar (Penglihatan Rendah)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Panduan Huruf Cermin */}
              <button
                onClick={() => {
                  sound.playPop();
                  setShowAccessMenu(false);
                  onOpenLetterConfusionModal();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>💡</span>
                  <span>Panduan Huruf b, d, p, q</span>
                </div>
                <span>Buka ➡️</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
