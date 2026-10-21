import React, { useState } from 'react';
import { Volume2, ChevronRight, ChevronLeft, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { IdiomItem } from '../types';
import { CORE_5_IDIOMS, SIMPULAN_BAHASA_LIST } from '../data/simpulanBahasaData';
import { speech } from '../utils/speech';
import { sound } from '../utils/soundEffects';

interface Screen1KenaliProps {
  onCompleteScreen: () => void;
  showSyllables: boolean;
  onBackToHome?: () => void;
}

export const Screen1Kenali: React.FC<Screen1KenaliProps> = ({
  onCompleteScreen,
  showSyllables,
  onBackToHome,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAllIdioms, setShowAllIdioms] = useState(false);
  const [activeTab, setActiveTab] = useState<'kiasan' | 'harfiah'>('kiasan');
  const [activeSyllableIdx, setActiveSyllableIdx] = useState<number | null>(null);

  const idiomList = showAllIdioms ? SIMPULAN_BAHASA_LIST : CORE_5_IDIOMS;
  const currentIdiom: IdiomItem = idiomList[selectedIndex] || idiomList[0];

  const handleSpeak = (text: string) => {
    sound.playPop();
    speech.speak(text);
  };

  const handleSpeakSingleSyllable = (syl: string, idx: number) => {
    sound.playSyllable();
    setActiveSyllableIdx(idx);
    speech.speak(syl, {
      rate: 0.7,
      onEnd: () => setActiveSyllableIdx(null),
    });
  };

  const handleSpeakSyllablesSequentially = async () => {
    sound.playPop();
    for (let i = 0; i < currentIdiom.syllables.length; i++) {
      setActiveSyllableIdx(i);
      sound.playSyllable();
      await speech.speak(currentIdiom.syllables[i], { rate: 0.65 });
      await new Promise((r) => setTimeout(r, 260));
    }
    setActiveSyllableIdx(null);
    await new Promise((r) => setTimeout(r, 200));
    speech.speak(currentIdiom.phrase, { rate: 0.85 });
  };

  const handleNext = () => {
    sound.playPop();
    setActiveSyllableIdx(null);
    if (selectedIndex < idiomList.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    } else {
      setSelectedIndex(0);
    }
  };

  const handlePrev = () => {
    sound.playPop();
    setActiveSyllableIdx(null);
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    } else {
      setSelectedIndex(idiomList.length - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 animate-fade-in space-y-6">
      {/* Clean Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              Aktiviti 1 daripada 6 • Kenali Peribahasa
            </span>
            {onBackToHome && (
              <>
                <span className="text-slate-300">•</span>
                <button
                  onClick={onBackToHome}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>🏠</span>
                  <span>Kembali ke Laman Utama</span>
                </button>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Jagalah Kebersihan & Kerajinan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Tekan butang pembesar suara untuk mendengar sebutan dan teliti maksud kiasan.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setShowAllIdioms(!showAllIdioms);
            setSelectedIndex(0);
          }}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 border border-slate-300 shadow-xs transition-colors cursor-pointer"
        >
          {showAllIdioms ? 'Tunjuk 5 Teras Utama' : 'Teroka Semua (20 Peribahasa)'}
        </button>
      </div>

      {/* Main Clean Flashcard Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
        {/* Card Status Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Kategori:</span>
            <span>{currentIdiom.category}</span>
          </div>
          <span className="font-semibold text-slate-500">
            Peribahasa {selectedIndex + 1} daripada {idiomList.length}
          </span>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          {/* Main Idiom Display with Clear Cartoon Image */}
          <div className="text-center space-y-4">
            {currentIdiom.imageUrl ? (
              <div className="flex justify-center">
                <div className="relative group max-w-[280px] sm:max-w-[340px] rounded-3xl overflow-hidden border-4 border-emerald-100 shadow-xl bg-white hover:scale-[1.02] transition-transform">
                  <img
                    src={currentIdiom.imageUrl}
                    alt={currentIdiom.phrase}
                    className="w-full aspect-square object-cover block"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Ilustrasi Kartun {currentIdiom.phrase}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-6xl sm:text-7xl select-none">
                {currentIdiom.emoji}
              </div>
            )}

            <div className="flex flex-col items-center justify-center gap-3">
              <div className="inline-flex items-center justify-center gap-3 flex-wrap">
                {showSyllables ? (
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {currentIdiom.syllables.map((syl, i) => {
                      const isHighlighted = activeSyllableIdx === i;
                      return (
                        <button
                          key={i}
                          onClick={() => handleSpeakSingleSyllable(syl, i)}
                          className={`text-2xl sm:text-4xl font-extrabold px-3.5 py-2 rounded-2xl border-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                            isHighlighted
                              ? 'bg-amber-400 text-amber-950 border-amber-600 scale-105 ring-4 ring-amber-200'
                              : i % 2 === 0
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                          }`}
                          title={`Tekan untuk dengar suku kata "${syl}"`}
                        >
                          {syl}
                          <span className="block text-[10px] font-semibold text-slate-500 mt-0.5">
                            {i + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-serif">
                    {currentIdiom.phrase}
                  </h2>
                )}

                <button
                  onClick={() => handleSpeak(currentIdiom.phrase)}
                  className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer hover:scale-105"
                  title="Dengar sebutan penuh"
                  aria-label="Dengar sebutan penuh"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Phonics sequential helper for Dyslexia */}
              {showSyllables && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSpeakSyllablesSequentially}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 shadow-xs cursor-pointer transition-colors"
                    title="Dengar sebutan suku kata satu demi satu secara berperingkat"
                  >
                    <span>🐢</span>
                    <span>Sebut Suku Kata Berperingkat</span>
                  </button>
                  <button
                    onClick={() => handleSpeak(currentIdiom.phrase)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Sebut Terus</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Clean Segmented View: Maksud Kiasan vs Maksud Sebenar */}
          <div className="space-y-4">
            <div className="flex bg-slate-100 p-1 rounded-xl max-w-md mx-auto">
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('kiasan');
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'kiasan'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ✨ Maksud Kiasan (Sebenar)
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('harfiah');
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'harfiah'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔍 Maksud Harfiah (Perkataan)
              </button>
            </div>

            {/* Meaning Card */}
            {activeTab === 'kiasan' ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                      Maksud Kiasan:
                    </span>
                    <p className="text-lg sm:text-xl font-bold text-emerald-950 mt-1">
                      "{currentIdiom.figurativeMeaning}"
                    </p>
                  </div>
                  <button
                    onClick={() => handleSpeak(currentIdiom.figurativeMeaning)}
                    className="p-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-100 shadow-xs shrink-0 cursor-pointer"
                    title="Dengar maksud kiasan"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-emerald-200/60 pt-2.5">
                  <strong>Penerangan Mudah:</strong> {currentIdiom.explanation}
                </p>

                {/* Contoh Ayat */}
                <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 mt-2 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Contoh Ayat Amalan Kebersihan:
                  </span>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 italic">
                      "{currentIdiom.exampleSentence}"
                    </p>
                    <button
                      onClick={() => handleSpeak(currentIdiom.exampleSentence)}
                      className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 shrink-0 cursor-pointer"
                      title="Dengar contoh ayat"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      Maksud Harfiah (Makna Sebenar Kata):
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                      "{currentIdiom.literalMeaning}"
                    </p>
                  </div>
                  <button
                    onClick={() => handleSpeak(currentIdiom.literalMeaning)}
                    className="p-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 shadow-xs shrink-0 cursor-pointer"
                    title="Dengar maksud harfiah"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic">
                  Ingat ya! Simpulan bahasa mempunyai maksud tersirat (kiasan), bukan maksud harfiah perkataannya.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Stepper Controls with Cartoon Thumbnails */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            {/* Cartoon Thumbnails Row */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {idiomList.slice(0, 5).map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playPop();
                      setSelectedIndex(idx);
                    }}
                    className={`p-1.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105 ring-2 ring-emerald-200'
                        : 'border-slate-200 bg-white hover:border-emerald-300 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.phrase}
                        className="w-10 h-10 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xl px-1">{item.emoji}</span>
                    )}
                    <span className="text-xs font-bold text-slate-800 pr-1.5 hidden sm:inline">
                      {item.phrase}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {/* Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {idiomList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playPop();
                      setSelectedIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === selectedIndex
                        ? 'w-6 bg-emerald-600'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Pergi ke peribahasa ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-200 transition-colors cursor-pointer"
              >
                <span>Seterusnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Bottom Advance Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            sound.playCorrect();
            onCompleteScreen();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <span>Selesai Kenali • Teruskan ke Modul Sebut (Skrin 2)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
