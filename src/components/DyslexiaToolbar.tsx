import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Sparkles,
  Sliders,
  Type,
  Eye,
  Check,
  X,
  Palette,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import {
  ThemeMode,
  TextSizeMode,
  FontMode,
  LetterSpacingMode,
  RulerColor,
} from '../types';
import { sound } from '../utils/soundEffects';
import { speech } from '../utils/speech';

interface DyslexiaToolbarProps {
  isDyslexiaMode: boolean;
  onToggleDyslexiaMode: () => void;
  showSyllables: boolean;
  onToggleSyllables: () => void;
  isReadingRulerActive: boolean;
  onToggleReadingRuler: () => void;
  rulerColor: RulerColor;
  onChangeRulerColor: (color: RulerColor) => void;
  letterSpacing: LetterSpacingMode;
  onLetterSpacingChange: (mode: LetterSpacingMode) => void;
  fontMode: FontMode;
  onFontModeChange: (font: FontMode) => void;
  textSize: TextSizeMode;
  onTextSizeChange: (size: TextSizeMode) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenLetterConfusionModal: () => void;
}

export const DyslexiaToolbar: React.FC<DyslexiaToolbarProps> = ({
  isDyslexiaMode,
  onToggleDyslexiaMode,
  showSyllables,
  onToggleSyllables,
  isReadingRulerActive,
  onToggleReadingRuler,
  rulerColor,
  onChangeRulerColor,
  letterSpacing,
  onLetterSpacingChange,
  fontMode,
  onFontModeChange,
  textSize,
  onTextSizeChange,
  theme,
  onThemeChange,
  onOpenLetterConfusionModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpeechRate, setCurrentSpeechRate] = useState<number>(() => speech.getRate());

  const handleSetSpeechRate = (rate: number) => {
    sound.playPop();
    speech.setRate(rate);
    setCurrentSpeechRate(rate);
    speech.speak(rate <= 0.7 ? 'Kelajuan suara perlahan.' : 'Kelajuan suara biasa.');
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 no-print">
      {/* Floating Toggle Pill / Trigger Button */}
      {!isOpen ? (
        <button
          onClick={() => {
            sound.playPop();
            setIsOpen(true);
          }}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl shadow-lg border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
            isDyslexiaMode
              ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 animate-pulse'
              : 'bg-white/95 backdrop-blur-md text-slate-800 border-slate-300 hover:bg-slate-50'
          }`}
          title="Buka Panel Bantuan Disleksia & MBPK"
        >
          <span className="text-xl">📖</span>
          <span className="text-xs font-black tracking-tight">
            {isDyslexiaMode ? 'Mod Disleksia: Aktif' : 'Bantuan Disleksia'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </button>
      ) : (
        /* Expanded Floating Accessibility Panel */
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/95 shadow-2xl rounded-3xl p-4 sm:p-5 w-[320px] sm:w-[360px] animate-fade-in space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <div>
                <h3 className="font-black text-sm text-slate-900 font-serif">
                  Alat Mesra Disleksia
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Sokongan Pembelajaran MBPK & Masalah Membaca
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
              title="Tutup panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Master Dyslexia Switch */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-black text-amber-950 block">
                Mod Disleksia Lengkap
              </span>
              <span className="text-[10px] text-amber-800/80 block leading-tight">
                Aktifkan fon Lexend, suku kata, latar krim & pembaris serentak.
              </span>
            </div>

            <button
              onClick={onToggleDyslexiaMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 shadow-xs ${
                isDyslexiaMode
                  ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-amber-100/50'
              }`}
            >
              {isDyslexiaMode ? 'ON ✓' : 'OFF'}
            </button>
          </div>

          {/* 2. Reading Ruler & Tint */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>📏</span>
                <span>Pembaris Bacaan Garis</span>
              </span>
              <button
                onClick={onToggleReadingRuler}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isReadingRulerActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isReadingRulerActive ? 'Aktif' : 'Tutup'}
              </button>
            </div>

            {isReadingRulerActive && (
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] font-semibold text-slate-500">Warna Lapisan:</span>
                {(['amber', 'blue', 'green', 'gray'] as RulerColor[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      sound.playPop();
                      onChangeRulerColor(c);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                      rulerColor === c
                        ? 'border-slate-800 ring-2 ring-slate-400 font-extrabold'
                        : 'border-slate-200'
                    } ${
                      c === 'amber'
                        ? 'bg-amber-200 text-amber-950'
                        : c === 'blue'
                        ? 'bg-sky-200 text-sky-950'
                        : c === 'green'
                        ? 'bg-emerald-200 text-emerald-950'
                        : 'bg-slate-200 text-slate-900'
                    }`}
                  >
                    {c === 'amber' ? 'Krim' : c === 'blue' ? 'Biru' : c === 'green' ? 'Hijau' : 'Kelabu'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Syllable Breakdown */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <span>🔤</span>
              <span>Pecahan Suku Kata Berwarna</span>
            </span>
            <button
              onClick={onToggleSyllables}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                showSyllables
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {showSyllables ? 'Aktif' : 'Tutup'}
            </button>
          </div>

          {/* 4. Speech Speed */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>🔊</span>
                <span>Kelajuan Suara Sebutan</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                {currentSpeechRate <= 0.75 ? 'Perlahan' : currentSpeechRate >= 1.0 ? 'Pantas' : 'Sederhana'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => handleSetSpeechRate(0.68)}
                className={`py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  currentSpeechRate <= 0.72
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                🐢 Perlahan
              </button>
              <button
                onClick={() => handleSetSpeechRate(0.85)}
                className={`py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  currentSpeechRate > 0.72 && currentSpeechRate < 0.95
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                🚶 Sederhana
              </button>
              <button
                onClick={() => handleSetSpeechRate(1.0)}
                className={`py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  currentSpeechRate >= 0.95
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                🏃 Biasa
              </button>
            </div>
          </div>

          {/* 5. Font Selection (Lexend, OpenDyslexic, Comic) */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <span>🅰️</span>
              <span>Fon Mesra Disleksia</span>
            </span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <button
                onClick={() => {
                  sound.playPop();
                  onFontModeChange('lexend');
                }}
                className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer font-lexend ${
                  fontMode === 'lexend'
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-400 font-extrabold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Lexend (Pilihan Disleksia)
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onFontModeChange('opendyslexic');
                }}
                className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer font-opendyslexic ${
                  fontMode === 'opendyslexic'
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-400 font-extrabold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                OpenDyslexic (Tapak Berat)
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onFontModeChange('comic');
                }}
                className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer font-comic ${
                  fontMode === 'comic'
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-400 font-extrabold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Comic Ceria
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onFontModeChange('sans');
                }}
                className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  fontMode === 'sans'
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-400 font-extrabold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Sistem Ringkas
              </button>
            </div>
          </div>

          {/* 6. Letter Spacing (Anti-Crowding) */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <span>↔️</span>
              <span>Penjarakan Huruf & Baris (Anti-Crowding)</span>
            </span>
            <div className="grid grid-cols-3 gap-1 text-[11px]">
              <button
                onClick={() => {
                  sound.playPop();
                  onLetterSpacingChange('normal');
                }}
                className={`py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  letterSpacing === 'normal'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Biasa
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onLetterSpacingChange('wide');
                }}
                className={`py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  letterSpacing === 'wide'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Luas (0.08em)
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onLetterSpacingChange('extra');
                }}
                className={`py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  letterSpacing === 'extra'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Ekstra Luas
              </button>
            </div>
          </div>

          {/* 7. Anti-Glare Screen Overlays (Irlen Tint) */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <span>🎨</span>
              <span>Warna Kertas Anti-Silau</span>
            </span>
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              <button
                onClick={() => {
                  sound.playPop();
                  onThemeChange('krim');
                }}
                className={`py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                  theme === 'krim'
                    ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-300'
                    : 'bg-[#fef7ee] text-amber-900 border-amber-200 hover:brightness-95'
                }`}
              >
                Krim Lembut
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onThemeChange('biru');
                }}
                className={`py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                  theme === 'biru'
                    ? 'bg-sky-100 border-sky-500 text-sky-950 ring-2 ring-sky-300'
                    : 'bg-[#eff6ff] text-sky-900 border-sky-200 hover:brightness-95'
                }`}
              >
                Biru Lembut
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onThemeChange('hijau');
                }}
                className={`py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                  theme === 'hijau'
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300'
                    : 'bg-[#f0fdf4] text-emerald-900 border-emerald-200 hover:brightness-95'
                }`}
              >
                Pudina
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onThemeChange('kontras');
                }}
                className={`py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                  theme === 'kontras'
                    ? 'bg-black text-yellow-300 border-yellow-400 ring-2 ring-yellow-400'
                    : 'bg-zinc-800 text-yellow-300 border-zinc-700 hover:brightness-110'
                }`}
              >
                Kontras
              </button>
            </div>
          </div>

          {/* 8. Letter Confusion Helper Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                sound.playPop();
                onOpenLetterConfusionModal();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">💡</span>
                <div className="text-left">
                  <span>Panduan Huruf b, d, p, q</span>
                  <span className="block text-[10px] text-amber-800/80 font-normal">
                    Mnemonik tangan & latihan beza huruf cermin
                  </span>
                </div>
              </div>
              <span className="text-xs">Buka ➡️</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
