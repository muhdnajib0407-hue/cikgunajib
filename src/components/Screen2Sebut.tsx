import React, { useState } from 'react';
import { Volume2, Mic, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CORE_5_IDIOMS } from '../data/simpulanBahasaData';
import { speech } from '../utils/speech';
import { sound } from '../utils/soundEffects';

interface Screen2SebutProps {
  onCompleteScreen: () => void;
  onAddStars: (amount: number) => void;
}

export const Screen2Sebut: React.FC<Screen2SebutProps> = ({
  onCompleteScreen,
  onAddStars,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSyllableIndex, setActiveSyllableIndex] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFeedback, setRecordingFeedback] = useState<string | null>(null);
  const [hasPracticed, setHasPracticed] = useState<boolean[]>(CORE_5_IDIOMS.map(() => false));

  const currentIdiom = CORE_5_IDIOMS[currentIndex];

  const handleSpeakSyllable = (syl: string, index: number) => {
    sound.playSyllable();
    setActiveSyllableIndex(index);
    speech.speak(syl, {
      rate: 0.7,
      onEnd: () => setActiveSyllableIndex(null),
    });
  };

  const handleSpeakFull = (rate: number = 0.85) => {
    sound.playPop();
    speech.speak(currentIdiom.phrase, { rate });
  };

  const handleStartMicPractice = () => {
    sound.playPop();
    setIsRecording(true);
    setRecordingFeedback(`Mendengar sebutan anda... Cuba sebut: "${currentIdiom.phrase}"`);

    setTimeout(() => {
      setIsRecording(false);
      sound.playCorrect();
      onAddStars(1);
      setRecordingFeedback(`🌟 Hebat sekali! Sebutan "${currentIdiom.phrase}" sangat jelas dan lancar!`);

      setHasPracticed((prev) => {
        const copy = [...prev];
        copy[currentIndex] = true;
        return copy;
      });
    }, 2400);
  };

  const handleNextIdiom = () => {
    sound.playPop();
    setRecordingFeedback(null);
    if (currentIndex < CORE_5_IDIOMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      sound.playWin();
      onCompleteScreen();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 animate-fade-in space-y-6">
      {/* Clean Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Modul 2 daripada 6 • Latihan Sebutan & Fonologi
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Sebut Suku Kata Bersama Simba
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Tekan setiap blok suku kata untuk mendengar sebutan satu per satu secara berperingkat.
          </p>
        </div>

        {/* Clean Step Counter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {CORE_5_IDIOMS.map((_, i) => (
            <span
              key={i}
              className={`h-2.5 rounded-full transition-all ${
                hasPracticed[i]
                  ? 'w-6 bg-emerald-600'
                  : i === currentIndex
                  ? 'w-6 bg-emerald-400'
                  : 'w-2.5 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Pronunciation Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-10 space-y-8 text-center">
        {/* Idiom Display with Cartoon Image */}
        <div className="space-y-3">
          {currentIdiom.imageUrl ? (
            <div className="flex justify-center">
              <div className="relative max-w-[200px] sm:max-w-[240px] rounded-2xl overflow-hidden border-4 border-emerald-100 shadow-md bg-white">
                <img
                  src={currentIdiom.imageUrl}
                  alt={currentIdiom.phrase}
                  className="w-full aspect-square object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ) : (
            <div className="text-5xl sm:text-6xl select-none">{currentIdiom.emoji}</div>
          )}
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif">
            {currentIdiom.phrase}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            "{currentIdiom.figurativeMeaning}"
          </p>
        </div>

        {/* Syllable Blocks (Interactive) */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Pecahan Suku Kata (Tekan untuk dengar):
          </span>
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap py-2">
            {currentIdiom.syllables.map((syl, idx) => {
              const isActive = activeSyllableIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSpeakSyllable(syl, idx)}
                  className={`min-w-[80px] sm:min-w-[100px] py-4 px-3 rounded-2xl border-2 text-2xl sm:text-4xl font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-700 scale-105 shadow-sm'
                      : idx % 2 === 0
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                  }`}
                  title={`Sebut ${syl}`}
                >
                  {syl}
                  <span className="block text-[10px] font-normal text-slate-500 mt-1 uppercase tracking-wider">
                    Suku kata {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Listening Options: Slow vs Normal Tempo */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleSpeakFull(0.65)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <span>🐢</span>
            <span>Sebut Perlahan</span>
          </button>
          <button
            onClick={() => handleSpeakFull(0.95)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-200 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <span>Sebut Penuh</span>
          </button>
        </div>

        {/* Microphone Recording Simulation */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Giliran Anda: Tekan Mikrofon & Sebut
          </span>

          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={handleStartMicPractice}
              disabled={isRecording}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105'
              }`}
              title="Tekan untuk bercakap"
            >
              <Mic className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>

            {/* Feedback message */}
            {recordingFeedback && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm max-w-md animate-fade-in">
                {recordingFeedback}
              </div>
            )}
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <button
            onClick={() => {
              sound.playPop();
              if (currentIndex > 0) setCurrentIndex((p) => p - 1);
            }}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={handleNextIdiom}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-102 cursor-pointer"
          >
            <span>
              {currentIndex < CORE_5_IDIOMS.length - 1
                ? 'Latihan Seterusnya'
                : 'Selesai Sebut • Jom Padankan (Skrin 3)'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
