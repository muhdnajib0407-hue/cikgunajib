import React, { useState } from 'react';
import { X, Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { speech } from '../utils/speech';
import { sound } from '../utils/soundEffects';

interface LetterConfusionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LetterCard {
  letter: 'b' | 'd' | 'p' | 'q';
  name: string;
  mnemonic: string;
  rule: string;
  exampleWord: string;
  emoji: string;
  color: string;
  handIcon: string;
}

const LETTER_GUIDES: LetterCard[] = [
  {
    letter: 'b',
    name: 'Huruf b (Kecil)',
    mnemonic: 'Tangan Kiri • Ibu jari ke atas',
    rule: 'Batang tiang dahulu di sebelah kiri, kemudian perut buncit di sebelah kanan (seperti Bentuk Baju).',
    exampleWord: 'Bersih, Basuh, Buang',
    emoji: '🧼',
    color: 'from-blue-500 to-indigo-600',
    handIcon: '👍 (Kiri)',
  },
  {
    letter: 'd',
    name: 'Huruf d (Kecil)',
    mnemonic: 'Tangan Kanan • Ibu jari ke atas',
    rule: 'Perut buncit dahulu di sebelah kiri, baru tarik tiang tegak di sebelah kanan (seperti Dada).',
    exampleWord: 'Duduk, Duit, Debu',
    emoji: '💨',
    color: 'from-emerald-500 to-teal-600',
    handIcon: '👍 (Kanan)',
  },
  {
    letter: 'p',
    name: 'Huruf p (Kecil)',
    mnemonic: 'Tangan Kiri • Ibu jari ke bawah',
    rule: 'Tiang tegak turun ke bawah garisan, kepala bulat di atas sebelah kanan (seperti Penyapu).',
    exampleWord: 'Penyapu, Pandai, Parit',
    emoji: '🧹',
    color: 'from-amber-500 to-orange-600',
    handIcon: '👎 (Kiri)',
  },
  {
    letter: 'q',
    name: 'Huruf q (Kecil)',
    mnemonic: 'Tangan Kanan • Ibu jari ke bawah',
    rule: 'Kepala bulat di sebelah kiri, tiang turun ke bawah garisan di sebelah kanan.',
    exampleWord: 'Qari, Quran',
    emoji: '📖',
    color: 'from-rose-500 to-pink-600',
    handIcon: '👎 (Kanan)',
  },
];

const MINI_QUIZ = [
  {
    word: '_ersih',
    options: ['b', 'd'],
    correct: 'b',
    fullWord: 'Bersih',
    meaning: 'Bebas daripada kotoran dan kuman.',
  },
  {
    word: '_ebu',
    options: ['b', 'd'],
    correct: 'd',
    fullWord: 'Debu',
    meaning: 'Habuk halus yang perlu disapu.',
  },
  {
    word: '_enyapu',
    options: ['p', 'q'],
    correct: 'p',
    fullWord: 'Penyapu',
    meaning: 'Alat untuk membersihkan lantai.',
  },
  {
    word: 'pan_ai',
    options: ['b', 'd'],
    correct: 'd',
    fullWord: 'Pandai',
    meaning: 'Murid yang rajin dan berilmu.',
  },
  {
    word: 'kam_ing',
    options: ['b', 'd'],
    correct: 'b',
    fullWord: 'Kambing',
    meaning: 'Haiwan jinak yang suka makan rumput.',
  },
];

export const LetterConfusionModal: React.FC<LetterConfusionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'panduan' | 'kuiz'>('panduan');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [starsWon, setStarsWon] = useState(0);

  if (!isOpen) return null;

  const currentQuiz = MINI_QUIZ[quizIndex];

  const handleSpeakLetter = (card: LetterCard) => {
    sound.playPop();
    speech.speak(
      `Ini ialah huruf ${card.letter}. ${card.rule}. Contoh perkataan: ${card.exampleWord}.`
    );
  };

  const handleAnswerQuiz = (letter: string) => {
    setSelectedAnswer(letter);
    if (letter === currentQuiz.correct) {
      sound.playCorrect();
      setQuizFeedback(`🌟 TEPAT SEKALI! Perkataan yang betul ialah "${currentQuiz.fullWord}".`);
      setStarsWon((prev) => prev + 1);
      speech.speak(`Hebat! ${currentQuiz.fullWord}. ${currentQuiz.meaning}`);
    } else {
      sound.playTryAgain();
      setQuizFeedback(`💡 Cuba lagi! Huruf yang betul ialah '${currentQuiz.correct}'.`);
      speech.speak(`Kurang tepat. Huruf yang betul ialah ${currentQuiz.correct} untuk ${currentQuiz.fullWord}.`);
    }
  };

  const handleNextQuiz = () => {
    sound.playPop();
    setSelectedAnswer(null);
    setQuizFeedback(null);
    if (quizIndex < MINI_QUIZ.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizIndex(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">💡</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-serif">
                Panduan Huruf Cermin (b, d, p, q)
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                Khas untuk Murid Berkeperluan Pendidikan Khas (Disleksia)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-amber-50/70 p-2 border-b border-amber-200/80 flex items-center justify-between gap-2 px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('panduan');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'panduan'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-100/50'
              }`}
            >
              📖 Carta Visual & Petua
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('kuiz');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'kuiz'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-100/50'
              }`}
            >
              🎯 Latihan Pantas ({quizIndex + 1}/{MINI_QUIZ.length})
            </button>
          </div>

          <button
            onClick={() => {
              speech.speak(
                'Gunakan kedua-dua tangan anda dengan ibu jari menghadap ke atas. Tangan kiri membentuk huruf b, tangan kanan membentuk huruf d.'
              );
            }}
            className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-white/80 hover:bg-white px-2.5 py-1 rounded-lg border border-amber-200 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dengar Petua</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'panduan' && (
            <div className="space-y-5">
              {/* Visual Bed Metaphor Explanation */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="text-4xl p-2 bg-white rounded-2xl shadow-xs">🛏️</div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm sm:text-base text-amber-950 font-serif">
                    Petua Mudah: Katil "b - e - d" (Bed)
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                    Huruf <strong>b</strong> adalah kepala katil di kiri, dan huruf <strong>d</strong> adalah hujung kaki katil di kanan. Kedua-duanya menghadap ke dalam tilam!
                  </p>
                </div>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {LETTER_GUIDES.map((card) => (
                  <div
                    key={card.letter}
                    className="p-4 rounded-2xl border border-slate-200/90 hover:border-amber-400 bg-white shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl font-black text-white bg-gradient-to-br ${card.color} shadow-xs font-serif`}
                        >
                          {card.letter}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{card.name}</h4>
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                            {card.handIcon}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSpeakLetter(card)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition-colors cursor-pointer"
                        title="Dengar sebutan"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {card.rule}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Contoh:</span>
                      <span className="font-bold text-slate-800">
                        {card.emoji} {card.exampleWord}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'kuiz' && (
            <div className="space-y-6 text-center py-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                  Soalan {quizIndex + 1} daripada {MINI_QUIZ.length}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                  Huruf apakah yang tertinggal?
                </h3>
              </div>

              {/* Big Word Display with missing letter */}
              <div className="py-6 px-8 rounded-3xl bg-slate-50 border-2 border-dashed border-amber-300 max-w-sm mx-auto">
                <div className="text-4xl sm:text-5xl font-black tracking-widest text-slate-900 font-serif">
                  {currentQuiz.word}
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  "{currentQuiz.meaning}"
                </p>
              </div>

              {/* Option Buttons */}
              <div className="flex items-center justify-center gap-4">
                {currentQuiz.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswerQuiz(opt)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl text-3xl sm:text-4xl font-black border-2 transition-all cursor-pointer shadow-md ${
                      selectedAnswer === opt
                        ? opt === currentQuiz.correct
                          ? 'bg-emerald-600 text-white border-emerald-700 scale-105'
                          : 'bg-rose-500 text-white border-rose-600 scale-105'
                        : 'bg-white hover:bg-amber-50 text-slate-900 border-amber-300 hover:border-amber-500'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {quizFeedback && (
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-bold max-w-md mx-auto animate-fade-in ${
                    selectedAnswer === currentQuiz.correct
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border border-rose-300 text-rose-950'
                  }`}
                >
                  {quizFeedback}
                </div>
              )}

              {/* Next Question Button */}
              {selectedAnswer && (
                <div className="pt-2">
                  <button
                    onClick={handleNextQuiz}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-102 cursor-pointer"
                  >
                    {quizIndex < MINI_QUIZ.length - 1 ? 'Soalan Seterusnya ➡️' : 'Ulang Semula Latihan 🔄'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>✨ Disokong oleh Pedagogi Pemulihan Khas & MBPK Disleksia</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
