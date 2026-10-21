import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Star,
  Check,
  X,
  BookOpen,
} from 'lucide-react';
import { CORE_5_IDIOMS } from '../data/simpulanBahasaData';
import { speech } from '../utils/speech';
import { sound } from '../utils/soundEffects';

interface Screen3PadankanProps {
  onCompleteScreen: () => void;
  onAddStars: (amount: number) => void;
  showSyllables?: boolean;
}

type ModeType = 'mbpk' | 'standard'; // 'mbpk' = 1 word provided, 'standard' = 2 empty slots

interface MeaningOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export const Screen3Padankan: React.FC<Screen3PadankanProps> = ({
  onCompleteScreen,
  onAddStars,
  showSyllables = false,
}) => {
  const [currentIdiomIndex, setCurrentIdiomIndex] = useState(0);
  const currentIdiom = CORE_5_IDIOMS[currentIdiomIndex];

  // Mode: MBPK (1 word provided) vs Standard (both empty)
  const [mode, setMode] = useState<ModeType>('mbpk');

  // Word slots: [slot0, slot1]
  const [slot0, setSlot0] = useState<string | null>(null);
  const [slot1, setSlot1] = useState<string | null>(null);

  // Word Bank available items
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);

  // Meaning Options for Matching
  const [meaningOptions, setMeaningOptions] = useState<MeaningOption[]>([]);
  const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(null);

  // States
  const [isWordsCorrect, setIsWordsCorrect] = useState(false);
  const [isMeaningCorrect, setIsMeaningCorrect] = useState(false);
  const [hasAwardedStars, setHasAwardedStars] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Extract correct words
  const targetWords = currentIdiom.phrase.split(' ');
  const correctWord0 = targetWords[0] || '';
  const correctWord1 = targetWords[1] || '';

  // Initialize round
  const initRound = useCallback(() => {
    const words = currentIdiom.phrase.split(' ');
    const w0 = words[0];
    const w1 = words[1];

    if (mode === 'mbpk') {
      // 1 word given as guidance for MBPK students
      setSlot0(w0);
      setSlot1(null);
    } else {
      // Standard mode: both slots empty
      setSlot0(null);
      setSlot1(null);
    }

    // Distractor pool
    const distractorPool = [
      'kaki',
      'tangan',
      'sampah',
      'peluh',
      'kudung',
      'bahu',
      'tulang',
      'mandi',
      'berat',
      'ringan',
    ].filter(
      (w) => w.toLowerCase() !== w0.toLowerCase() && w.toLowerCase() !== w1.toLowerCase()
    );

    const shuffledDistractors = [...distractorPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const bank = mode === 'mbpk' ? [w1, ...shuffledDistractors] : [w0, w1, ...shuffledDistractors];
    setAvailableWords(bank.sort(() => Math.random() - 0.5));

    // Prepare 3 Meaning Options (1 correct, 2 distractors from other idioms)
    const otherIdioms = CORE_5_IDIOMS.filter((i) => i.id !== currentIdiom.id);
    const shuffledOthers = [...otherIdioms].sort(() => Math.random() - 0.5);

    const options: MeaningOption[] = [
      {
        id: currentIdiom.id,
        text: currentIdiom.figurativeMeaning,
        isCorrect: true,
      },
      {
        id: shuffledOthers[0].id,
        text: shuffledOthers[0].figurativeMeaning,
        isCorrect: false,
      },
      {
        id: shuffledOthers[1].id,
        text: shuffledOthers[1].figurativeMeaning,
        isCorrect: false,
      },
    ].sort(() => Math.random() - 0.5);

    setMeaningOptions(options);
    setSelectedMeaningId(null);
    setIsWordsCorrect(false);
    setIsMeaningCorrect(false);
    setHasAwardedStars(false);
    setFeedbackMessage('');
  }, [currentIdiom, mode]);

  useEffect(() => {
    initRound();
  }, [initRound]);

  // Check word slots
  useEffect(() => {
    const isW0Right = slot0?.trim().toLowerCase() === correctWord0.toLowerCase();
    const isW1Right = slot1?.trim().toLowerCase() === correctWord1.toLowerCase();

    if (isW0Right && isW1Right) {
      if (!isWordsCorrect) {
        setIsWordsCorrect(true);
        sound.playCorrect();
        sound.playPop();
        setFeedbackMessage('🎉 Tepat sekali susunan simpulan bahasa! Sekarang padankan maksudnya di bawah.');
        speech.speak(`Hebat! ${currentIdiom.phrase}. Sekarang padankan maksud yang betul!`);
      }
    } else {
      setIsWordsCorrect(false);
    }
  }, [slot0, slot1, correctWord0, correctWord1, isWordsCorrect, currentIdiom.phrase]);

  // Select a word from the bank (tap to place)
  const handleSelectWord = (word: string) => {
    sound.playPop();
    speech.speak(word, { rate: 0.85 });

    if (!slot0 && mode === 'standard') {
      setSlot0(word);
      setAvailableWords((prev) => {
        const idx = prev.indexOf(word);
        if (idx > -1) {
          const next = [...prev];
          next.splice(idx, 1);
          return next;
        }
        return prev;
      });
    } else if (!slot1) {
      setSlot1(word);
      setAvailableWords((prev) => {
        const idx = prev.indexOf(word);
        if (idx > -1) {
          const next = [...prev];
          next.splice(idx, 1);
          return next;
        }
        return prev;
      });
    }
  };

  // Remove word from slot (tap to remove)
  const handleRemoveFromSlot = (slotIndex: 0 | 1) => {
    if (slotIndex === 0) {
      if (mode === 'mbpk') return; // Locked in MBPK mode
      if (slot0) {
        sound.playPop();
        setAvailableWords((prev) => [...prev, slot0]);
        setSlot0(null);
      }
    } else {
      if (slot1) {
        sound.playPop();
        setAvailableWords((prev) => [...prev, slot1]);
        setSlot1(null);
      }
    }
  };

  // Drag and drop handlers
  const handleDragStart = (word: string) => {
    setDraggedWord(word);
  };

  const handleDropToSlot = (slotIndex: 0 | 1) => {
    if (!draggedWord) return;
    if (slotIndex === 0 && mode === 'mbpk') return;

    sound.playPop();
    if (slotIndex === 0) {
      if (slot0) setAvailableWords((prev) => [...prev, slot0]);
      setSlot0(draggedWord);
    } else {
      if (slot1) setAvailableWords((prev) => [...prev, slot1]);
      setSlot1(draggedWord);
    }

    setAvailableWords((prev) => {
      const idx = prev.indexOf(draggedWord);
      if (idx > -1) {
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      }
      return prev;
    });

    setDraggedWord(null);
  };

  // Meaning selection handler
  const handleSelectMeaning = (option: MeaningOption) => {
    sound.playPop();
    setSelectedMeaningId(option.id);

    if (option.isCorrect) {
      sound.playWin();
      setIsMeaningCorrect(true);
      setFeedbackMessage('🌟 Tahniah! Maksud simpulan bahasa ini tepat sekali!');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (_) {}

      speech.speak(`Tahniah! ${currentIdiom.phrase} bermaksud ${option.text}`);

      if (!hasAwardedStars) {
        onAddStars(2);
        setHasAwardedStars(true);
      }
    } else {
      sound.playPop();
      setIsMeaningCorrect(false);
      setFeedbackMessage('Cuba lagi ya! Dengar semula maksud dan pilih yang tepat.');
      speech.speak('Cuba lagi ya! Pilih maksud yang paling sesuai.');
    }
  };

  const handleNextIdiom = () => {
    sound.playPop();
    if (currentIdiomIndex < CORE_5_IDIOMS.length - 1) {
      setCurrentIdiomIndex((prev) => prev + 1);
    } else {
      // Completed all 5 idioms in Activity 3
      sound.playWin();
      onCompleteScreen();
    }
  };

  const isRoundComplete = isWordsCorrect && isMeaningCorrect;

  return (
    <div className="max-w-4xl mx-auto py-5 px-3 sm:px-6 space-y-6 animate-fade-in">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              Aktiviti 3 daripada 6 • Padankan Perkataan & Maksud
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Padankan Simpulan Bahasa
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Lengkapkan 2 perkataan simpulan bahasa, kemudian pilih kad maksud yang tepat.
          </p>
        </div>

        {/* Mode Selector (MBPK Scaffolding vs Standard) */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => {
              sound.playPop();
              setMode('mbpk');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'mbpk'
                ? 'bg-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Mod mesra murid MBPK: 1 perkataan dibimbing siap sedia"
          >
            <span>🌟</span>
            <span>Bimbingan MBPK (1 Kotak Siap)</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setMode('standard');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'standard'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Mod Murid Pandai: Isi kedua-dua tempat kosong"
          >
            <span>⚡</span>
            <span>Murid Pandai (2 Kotak Kosong)</span>
          </button>
        </div>
      </div>

      {/* Stepper Tabs for 5 Core Idioms */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CORE_5_IDIOMS.map((idiom, idx) => {
          const isCurrent = idx === currentIdiomIndex;
          return (
            <button
              key={idiom.id}
              onClick={() => {
                sound.playPop();
                setCurrentIdiomIndex(idx);
              }}
              className={`flex-1 min-w-[125px] p-2 rounded-2xl border-2 transition-all flex items-center gap-2 cursor-pointer ${
                isCurrent
                  ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                  : 'border-slate-200 bg-white hover:border-slate-300 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                {idiom.imageUrl ? (
                  <img src={idiom.imageUrl} alt={idiom.phrase} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm">{idiom.emoji}</span>
                )}
              </div>
              <div className="text-left overflow-hidden">
                <span className="text-[11px] font-bold text-slate-800 truncate block">
                  {idx + 1}. {idiom.phrase}
                </span>
                <span className="text-[9px] text-slate-500 block">
                  {idx === currentIdiomIndex ? '👉 Sedang Main' : 'Pilih'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Single Card: Picture + 2 Word Slots + Meaning Matching */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-slate-200 shadow-lg space-y-8">
        {/* Top: Cartoon Illustration & Title */}
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
          <div className="relative group max-w-[220px] w-full aspect-square rounded-3xl overflow-hidden bg-slate-100 border-3 border-emerald-400 shadow-md shrink-0">
            {currentIdiom.imageUrl ? (
              <img
                src={currentIdiom.imageUrl}
                alt={currentIdiom.phrase}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">
                {currentIdiom.emoji}
              </div>
            )}
            <div className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
              {currentIdiomIndex + 1}/5
            </div>
          </div>

          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-slate-100 px-2.5 py-1 rounded-md">
              Kategori: {currentIdiom.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              {isWordsCorrect ? (
                <span className="text-emerald-700 flex items-center gap-2">
                  <span>{currentIdiom.phrase}</span>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 inline" />
                </span>
              ) : (
                <span>Lengkapkan Simpulan Bahasa:</span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Tarik atau klik perkataan di bawah untuk mengisi tempat kosong yang bersesuaian dengan gambar.
            </p>
            <button
              onClick={() => {
                sound.playPop();
                speech.speak(currentIdiom.phrase);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>🔊 Dengar Sebutan Simpulan Bahasa</span>
            </button>
          </div>
        </div>

        {/* Middle: 2 Tempat Kosong & Bank Perkataan */}
        <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border-2 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>📝</span>
              <span>2 Tempat Kosong Simpulan Bahasa:</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {mode === 'mbpk' ? 'Kotak 1 telah disediakan' : 'Isi kedua-dua kotak'}
            </span>
          </div>

          {/* 2 Drop Slots */}
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* Tempat Kosong 1 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropToSlot(0)}
              onClick={() => handleRemoveFromSlot(0)}
              className={`min-h-[85px] sm:min-h-[95px] rounded-2xl border-3 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer relative ${
                slot0
                  ? slot0.toLowerCase() === correctWord0.toLowerCase()
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black shadow-xs'
                    : 'border-rose-400 bg-rose-50 text-rose-950 font-bold'
                  : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/30'
              }`}
            >
              {mode === 'mbpk' && (
                <span className="absolute top-1.5 left-2 text-[9px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  🌟 Bimbingan
                </span>
              )}
              {slot0 ? (
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-black">{slot0}</span>
                  {mode !== 'mbpk' && (
                    <span className="text-[10px] text-slate-400 mt-1">Tekan untuk batal</span>
                  )}
                </div>
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <span className="text-sm font-bold">[ Kotak 1 ]</span>
                  <span className="text-[11px]">Tarik perkataan pertama</span>
                </div>
              )}
            </div>

            {/* Tempat Kosong 2 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropToSlot(1)}
              onClick={() => handleRemoveFromSlot(1)}
              className={`min-h-[85px] sm:min-h-[95px] rounded-2xl border-3 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer relative ${
                slot1
                  ? slot1.toLowerCase() === correctWord1.toLowerCase()
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black shadow-xs'
                    : 'border-rose-400 bg-rose-50 text-rose-950 font-bold'
                  : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/30'
              }`}
            >
              {slot1 ? (
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-black">{slot1}</span>
                  <span className="text-[10px] text-slate-400 mt-1">Tekan untuk batal</span>
                </div>
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <span className="text-sm font-bold">[ Kotak 2 ]</span>
                  {mode === 'mbpk' ? (
                    <span className="text-[11px] text-amber-700 font-bold">
                      Pilih perkataan di bawah
                    </span>
                  ) : (
                    <span className="text-[11px]">Tarik perkataan kedua</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Word Bank: Pilihan Perkataan Kat Bawah */}
          <div className="pt-2 text-center">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Pilihan Perkataan (Tarik atau Tekan untuk Isi):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {availableWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  draggable
                  onDragStart={() => handleDragStart(word)}
                  onClick={() => handleSelectWord(word)}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-emerald-300 hover:border-emerald-500 text-slate-800 font-black text-sm sm:text-base shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-grab active:cursor-grabbing flex items-center gap-2"
                >
                  <span>{word}</span>
                  <Volume2
                    className="w-4 h-4 text-emerald-600 hover:text-emerald-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      speech.speak(word);
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Padankan Maksud Simpulan Bahasa */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-serif">
                Padankan Maksud Bagi Simpulan Bahasa Ini:
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Pilih satu maksud yang tepat di bawah
            </span>
          </div>

          {/* 3 Meaning Options Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {meaningOptions.map((opt, idx) => {
              const isSelected = selectedMeaningId === opt.id;
              const isCorrectAndSelected = isSelected && opt.isCorrect;
              const isWrongAndSelected = isSelected && !opt.isCorrect;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectMeaning(opt)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                    isCorrectAndSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-3 ring-emerald-200 shadow-md scale-102'
                      : isWrongAndSelected
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200'
                      : 'bg-slate-50 hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Pilihan {idx + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speech.speak(opt.text);
                      }}
                      className="p-1 rounded-lg bg-white/80 hover:bg-white text-slate-700 shadow-xs"
                      title="Dengar maksud"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-700" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug font-serif flex-1">
                    "{opt.text}"
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">
                      {isCorrectAndSelected ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" /> Maksud Tepat!
                        </span>
                      ) : isWrongAndSelected ? (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <X className="w-4 h-4" /> Bukan ini, cuba lagi
                        </span>
                      ) : (
                        'Tekan untuk pilih'
                      )}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                        isCorrectAndSelected
                          ? 'bg-emerald-600 text-white'
                          : isWrongAndSelected
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCorrectAndSelected ? '✓' : idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackMessage && (
          <div
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fade-in ${
              isMeaningCorrect && isWordsCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <span className="text-xl">
              {isMeaningCorrect && isWordsCorrect ? '🎉' : '💡'}
            </span>
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={initRound}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mula Semula Pusingan</span>
          </button>

          <button
            onClick={handleNextIdiom}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-md transition-all cursor-pointer ${
              isRoundComplete
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white scale-102 ring-4 ring-emerald-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <span>
              {currentIdiomIndex < CORE_5_IDIOMS.length - 1
                ? isRoundComplete
                  ? 'Syabas! Pergi Peribahasa Seterusnya ➔'
                  : 'Peribahasa Seterusnya ➔'
                : 'Selesai Aktiviti 3 • Ke Kembara Simba (Skrin 4) ➔'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
