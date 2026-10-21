import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  Send,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { CORE_5_IDIOMS, SIMPULAN_BAHASA_LIST } from '../data/simpulanBahasaData';
import { SentenceEvaluation } from '../types';
import { speech } from '../utils/speech';
import { sound } from '../utils/soundEffects';

interface Screen5BerceritaProps {
  onCompleteScreen: () => void;
  onAddStars: (amount: number) => void;
  showSyllables?: boolean;
}

interface StoryChapter {
  id: number;
  title: string;
  emoji: string;
  text: string;
  idiomsIncluded: { phrase: string; meaning: string; emoji: string }[];
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: 'Babak 1: Taman Ceria yang Tercemar',
    emoji: '🍂',
    text: 'Pada suatu petang, Simba dan kawan-kawannya pergi ke Taman Ceria. Alangkah sedihnya mereka melihat botol plastik, tin kosong, dan daun-daun kering bersepah di merata tempat! Simba berasa sangat geli geleman melihat sampah yang berbau itu. Keadaan ini telah membuka celik mata mereka bahawa mereka perlu bertindak segera menjaga kebersihan alam sekitar.',
    idiomsIncluded: [
      { phrase: 'Geli geleman', meaning: 'Berasa jijik melihat sampah kotor dan segera mahu membersihkannya', emoji: '🤢' },
      { phrase: 'Celik mata', meaning: 'Mula sedar dan peka tentang pentingnya amalan menjaga kebersihan', emoji: '👁️' },
    ],
  },
  {
    id: 2,
    title: 'Babak 2: Tindakan Wira Ringan Tulang',
    emoji: '🧹',
    text: 'Tanpa membuang masa, Simba dan Siti yang bersikap ringan tulang terus mengambil penyapu dan beg plastik kitar semula. Siti mengutip sampah dengan sangat pantas seperti lipas kudung. Dalam sekelip mata, kawasan taman permainan yang bersepah tadi sudah mula kelihatan bersih dan teratur.',
    idiomsIncluded: [
      { phrase: 'Ringan tulang', meaning: 'Orang yang sangat rajin bekerja dan cepat menolong menjaga kebersihan', emoji: '🧹' },
      { phrase: 'Lipas kudung', meaning: 'Membuat kerja mengemas dan mencuci dengan sangat pantas dan tangkas', emoji: '⚡' },
    ],
  },
  {
    id: 3,
    title: 'Babak 3: Berganding Bahu & Mandi Peluh',
    emoji: '🤝',
    text: 'Melihat kesungguhan Simba dan Siti, Tok Gajah dan penduduk kampung turut berganding bahu menyertai aktiviti gotong-royong. Di bawah sinaran mentari, mereka rela mandi peluh mengorek parit yang tersumbat sebagai langkah sedia payung sebelum hujan agar air mengalir lancar dan nyamuk aedes tidak dapat membiak.',
    idiomsIncluded: [
      { phrase: 'Berganding bahu', meaning: 'Bekerjasama padu dan tolong-menolong membersihkan kawasan persekitaran', emoji: '🤝' },
      { phrase: 'Mandi peluh', meaning: 'Bekerja dengan kuat dan bersungguh-sungguh hingga basah berpeluh demi kebersihan', emoji: '💦' },
      { phrase: 'Sedia payung sebelum hujan', meaning: 'Berwaspada membersihkan longkang awal-awal sebelum banjir atau wabak melanda', emoji: '☔' },
    ],
  },
  {
    id: 4,
    title: 'Babak 4: Sang Monyet Berubah Sikap',
    emoji: '🐵',
    text: 'Di atas sebatang pokok, Sang Monyet yang dahulunya berat tulang dan suka mencampakkan kulit pisang mula berasa malu. Sang Monyet melompat turun lalu menggunakan tulang empat kerat miliknya untuk menyapu daun-daun kering. Semua orang tersenyum gembira melihat perubahan sikapnya yang kini rajin membantu!',
    idiomsIncluded: [
      { phrase: 'Berat tulang', meaning: 'Orang yang malas bekerja atau malas membuang sampah (sifat yang perlu dihindari)', emoji: '🦥' },
      { phrase: 'Tulang empat kerat', meaning: 'Menggunakan kudrat dan tenaga fizikal dengan rajin untuk membersihkan kawasan', emoji: '💪' },
    ],
  },
  {
    id: 5,
    title: 'Babak 5: Taman Berseri, Minda Bersih',
    emoji: '🌸',
    text: 'Kini, Taman Ceria sudah kembali indah, wangi dan segar! Semua penduduk bersyukur kerana dengan hati bersih, mereka telah menyelamatkan taman itu. Simba berpesan bahawa kebersihan asas kesihatan dan bersih pangkal pandai. Apabila tempat kita bersih, badan kita sihat dan fikiran kita menjadi cerdas!',
    idiomsIncluded: [
      { phrase: 'Hati bersih', meaning: 'Ikhlas dan berbuat kebaikan membersihkan persekitaran tanpa mengeluh', emoji: '🤍' },
      { phrase: 'Kebersihan asas kesihatan', meaning: 'Amalan menjaga kebersihan diri dan persekitaran menjauhkan penyakit', emoji: '🧼' },
      { phrase: 'Bersih pangkal pandai', meaning: 'Kawasan dan diri yang bersih melahirkan minda cerdas dan cemerlang', emoji: '💡' },
    ],
  },
];

export const Screen5Bercerita: React.FC<Screen5BerceritaProps> = ({
  onCompleteScreen,
  onAddStars,
}) => {
  const [activeTab, setActiveTab] = useState<'cerita' | 'kuizCerita' | 'binaAyat'>('cerita');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [selectedIdiomModal, setSelectedIdiomModal] = useState<{
    phrase: string;
    meaning: string;
    emoji: string;
  } | null>(null);

  // Bina Ayat State
  const [selectedIdiom, setSelectedIdiom] = useState(CORE_5_IDIOMS[0]);
  const [sentenceText, setSentenceText] = useState('');
  const [selectedWordBlocks, setSelectedWordBlocks] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SentenceEvaluation | null>(null);

  // Kuiz Cerita State
  const [storyQuizScore, setStoryQuizScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({});

  // Dyslexia Read-Along Tracking State
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const currentChapter = STORY_CHAPTERS[currentChapterIndex];

  // Split chapter into sentences for dyslexic visual tracking
  const chapterSentences = currentChapter.text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const handleSpeakSentence = (sentence: string, index: number, rate = 0.8) => {
    sound.playPop();
    speech.stop();
    setActiveSentenceIndex(index);
    setIsReadingAloud(true);
    speech.speak(sentence, {
      rate,
      onEnd: () => {
        setActiveSentenceIndex(null);
        setIsReadingAloud(false);
      },
    });
  };

  const handleSpeakChapter = async (rate = 0.8) => {
    sound.playPop();
    speech.stop();
    setIsReadingAloud(true);

    // Speak title first
    await speech.speak(currentChapter.title, { rate });
    await new Promise((r) => setTimeout(r, 200));

    // Speak sentences one by one, keeping active highlight
    for (let i = 0; i < chapterSentences.length; i++) {
      setActiveSentenceIndex(i);
      await speech.speak(chapterSentences[i], { rate });
      await new Promise((r) => setTimeout(r, 240));
    }

    setActiveSentenceIndex(null);
    setIsReadingAloud(false);
  };

  const handleStopReading = () => {
    sound.playPop();
    speech.stop();
    setActiveSentenceIndex(null);
    setIsReadingAloud(false);
  };

  const handleNextChapter = () => {
    sound.playPop();
    handleStopReading();
    if (currentChapterIndex < STORY_CHAPTERS.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
    }
  };

  const handlePrevChapter = () => {
    sound.playPop();
    handleStopReading();
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
    }
  };

  const handleAddWord = (word: string) => {
    sound.playPop();
    const updated = [...selectedWordBlocks, word];
    setSelectedWordBlocks(updated);
    setSentenceText(updated.join(' '));
  };

  const handleRemoveLastWord = () => {
    sound.playPop();
    const updated = selectedWordBlocks.slice(0, -1);
    setSelectedWordBlocks(updated);
    setSentenceText(updated.join(' '));
  };

  const handleClear = () => {
    sound.playPop();
    setSelectedWordBlocks([]);
    setSentenceText('');
    setEvaluation(null);
  };

  const handleEvaluateSentence = async () => {
    if (!sentenceText.trim()) return;

    sound.playPop();
    setIsEvaluating(true);
    setEvaluation(null);

    try {
      const res = await fetch('/api/eval-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence: sentenceText.trim(),
          idiom: selectedIdiom.phrase,
          meaning: selectedIdiom.figurativeMeaning,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluation(data);
        if (data.status === 'cemerlang' || data.status === 'baik') {
          sound.playCorrect();
          onAddStars(3);
        } else {
          sound.playTryAgain();
        }
        speech.speak(`${data.pujian}. ${data.maklumBalas}`);
      } else {
        throw new Error('API response not ok');
      }
    } catch (e) {
      const clean = sentenceText.toLowerCase();
      const contains = clean.includes(selectedIdiom.phrase.toLowerCase());
      const words = clean.split(/\s+/).filter(Boolean);

      let fallbackEval: SentenceEvaluation;
      if (contains && words.length >= 4) {
        fallbackEval = {
          status: 'cemerlang',
          markah: 95,
          pujian: '🌟 Syabas dan tahniah! Ayat anda sangat mantap dan bermakna!',
          maklumBalas: `Penggunaan peribahasa "${selectedIdiom.phrase}" sangat tepat dengan amalan menjaga kebersihan.`,
          cadanganAyat: sentenceText,
          kriteria: { adaSimpulanBahasa: true, panjangMencukupi: true, konteksSesuai: true },
        };
        sound.playCorrect();
        onAddStars(3);
      } else if (contains) {
        fallbackEval = {
          status: 'baik',
          markah: 70,
          pujian: 'Bagus! Peribahasa kebersihan dimasukkan dengan betul.',
          maklumBalas: `Boleh tambah sedikit penerangan atau kata kerja seperti menyapu sampah supaya ayat lebih lengkap.`,
          cadanganAyat: selectedIdiom.exampleSentence,
          kriteria: { adaSimpulanBahasa: true, panjangMencukupi: false, konteksSesuai: true },
        };
        sound.playCorrect();
        onAddStars(2);
      } else {
        fallbackEval = {
          status: 'bimbingan',
          markah: 45,
          pujian: 'Usaha yang baik! Mari masukkan peribahasa tersebut.',
          maklumBalas: `Pastikan anda menyertakan "${selectedIdiom.phrase}" di dalam ayat anda.`,
          cadanganAyat: selectedIdiom.exampleSentence,
          kriteria: { adaSimpulanBahasa: false, panjangMencukupi: true, konteksSesuai: false },
        };
        sound.playTryAgain();
      }
      setEvaluation(fallbackEval);
      speech.speak(`${fallbackEval.pujian}. ${fallbackEval.maklumBalas}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const storyQuestions = [
    {
      id: 1,
      q: 'Mengapakah Siti dan Simba digelar sebagai "ringan tulang"?',
      options: [
        { text: 'Kerana mereka terus mengambil penyapu dan beg sampah membersihkan taman', correct: true },
        { text: 'Kerana mereka duduk di bawah pokok melihat sampah berselerak', correct: false },
      ],
      explanation: 'Betul! Murid ringan tulang sentiasa rajin dan cepat membantu membersihkan tempat tanpa disuruh.',
    },
    {
      id: 2,
      q: 'Apakah yang dilakukan oleh penduduk kampung semasa "berganding bahu"?',
      options: [
        { text: 'Mereka bekerjasama bergotong-royong mengorek longkang tersumbat', correct: true },
        { text: 'Mereka berebut-rebut membuang sampah ke dalam sungai', correct: false },
      ],
      explanation: 'Tepat sekali! Berganding bahu bermaksud bekerjasama padu demi kebersihan bersama.',
    },
    {
      id: 3,
      q: 'Apakah amalan baik yang dipelajari oleh Sang Monyet yang dahulunya "berat tulang"?',
      options: [
        { text: 'Menggunakan tenaganya menyapu daun kering dan tidak buang sampah merata-rata', correct: true },
        { text: 'Tidur lena di atas pokok dan enggan membantu', correct: false },
      ],
      explanation: 'Hebat! Sang Monyet kini rajin dan insaf akan pentingnya menjaga kebersihan persekitaran.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 animate-fade-in space-y-6">
      {/* Clean Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Modul 5 daripada 6 • Bercerita & Bina Ayat
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Misi Jagalah Kebersihan Taman Ceria
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Baca kisah teladan kebersihan, tekan perkataan bergaris untuk dengar maksud, dan bina ayat anda.
          </p>
        </div>

        {/* Clean Segmented Navigation Tab */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('cerita');
            }}
            className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'cerita'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📖 Kisah Cerita
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('kuizCerita');
            }}
            className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'kuizCerita'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ❓ Uji Kefahaman
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('binaAyat');
            }}
            className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'binaAyat'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✍️ Bina Ayat
          </button>
        </div>
      </div>

      {/* TAB 1: BACA KISAH CERITA */}
      {activeTab === 'cerita' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          {/* Chapter Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentChapter.emoji}</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                {currentChapter.title}
              </h2>
            </div>

            {/* Read-Along Audio Controls */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {isReadingAloud ? (
                <button
                  onClick={handleStopReading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs border border-rose-300 transition-colors cursor-pointer animate-pulse"
                >
                  <span>⏹️ Berhenti</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleSpeakChapter(0.68)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition-colors cursor-pointer"
                    title="Dengar bacaan perlahan khas disleksia"
                  >
                    <span>🐢 Baca Perlahan</span>
                  </button>
                  <button
                    onClick={() => handleSpeakChapter(0.85)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    title="Dengar seluruh cerita"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengar Cerita 🔊</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Dyslexia Guidance Tip */}
          <div className="bg-amber-50/80 px-3.5 py-2 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs text-amber-950 font-medium">
            <div className="flex items-center gap-2">
              <span>💡</span>
              <span>
                <strong>Petua Disleksia:</strong> Tekan mana-mana ayat untuk mendengar sebutan satu baris secara berfokus.
              </span>
            </div>
            {activeSentenceIndex !== null && (
              <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-[11px]">
                Baris {activeSentenceIndex + 1} sedang dibaca
              </span>
            )}
          </div>

          {/* Interactive Sentence-by-Sentence Paragraph */}
          <div className="p-5 sm:p-7 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
            {chapterSentences.map((sentence, sIdx) => {
              const isSentenceActive = activeSentenceIndex === sIdx;

              return (
                <div
                  key={sIdx}
                  className={`p-3 rounded-2xl transition-all cursor-pointer group border ${
                    isSentenceActive
                      ? 'bg-amber-100/90 border-amber-400 shadow-sm ring-2 ring-amber-300/80'
                      : 'bg-white/80 hover:bg-emerald-50/60 border-slate-200/70 hover:border-emerald-300'
                  }`}
                  onClick={() => handleSpeakSentence(sentence, sIdx, 0.78)}
                  title="Tekan untuk dengar ayat ini"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-base sm:text-lg font-medium leading-loose text-slate-800 flex-1">
                      {sentence.split(/(geli geleman|celik mata|ringan tulang|lipas kudung|berganding bahu|mandi peluh|sedia payung sebelum hujan|berat tulang|tulang empat kerat|hati bersih|kebersihan asas kesihatan|bersih pangkal pandai)/gi).map((part, idx) => {
                        const match = currentChapter.idiomsIncluded.find(
                          (i) => i.phrase.toLowerCase() === part.toLowerCase()
                        );
                        if (match) {
                          return (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                sound.playPop();
                                setSelectedIdiomModal(match);
                                speech.speak(`${match.phrase} bermaksud ${match.meaning}`);
                              }}
                              className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold underline decoration-emerald-500 cursor-pointer transition-colors shadow-2xs"
                              title="Klik untuk lihat maksud peribahasa ini"
                            >
                              <span>{match.emoji}</span>
                              <span>{part}</span>
                            </button>
                          );
                        }
                        return <span key={idx}>{part}</span>;
                      })}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakSentence(sentence, sIdx, 0.78);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition-colors opacity-70 group-hover:opacity-100 shrink-0"
                      title="Dengar ayat ini"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterIndex === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Chapter Dots */}
            <div className="flex items-center gap-1.5">
              {STORY_CHAPTERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playPop();
                    setCurrentChapterIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentChapterIndex === idx
                      ? 'w-6 bg-emerald-600'
                      : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Babak ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (currentChapterIndex < STORY_CHAPTERS.length - 1) {
                  handleNextChapter();
                } else {
                  sound.playCorrect();
                  onAddStars(2);
                  setActiveTab('kuizCerita');
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <span>{currentChapterIndex < STORY_CHAPTERS.length - 1 ? 'Seterusnya' : 'Jawab Kuiz Cerita'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: UJI KEFAHAMAN CERITA */}
      {activeTab === 'kuizCerita' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                Uji Kefahaman Kisah Kebersihan
              </h2>
              <p className="text-xs text-slate-500">
                Pilih jawapan yang betul berdasarkan kisah yang telah anda baca.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg">
              Skor: {storyQuizScore} / {storyQuestions.length} Bintang
            </span>
          </div>

          <div className="space-y-4">
            {storyQuestions.map((sq, index) => {
              const isAnswered = answeredQuestions[sq.id] !== undefined;
              return (
                <div key={sq.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <p className="font-bold text-slate-900 text-sm sm:text-base">
                    {index + 1}. {sq.q}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sq.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => {
                          if (opt.correct) {
                            sound.playCorrect();
                            onAddStars(1);
                            setStoryQuizScore((prev) => prev + 1);
                            speech.speak(`Tepat sekali! ${sq.explanation}`);
                          } else {
                            sound.playTryAgain();
                            speech.speak('Cuba lagi! Fikirkan maksud peribahasa tersebut.');
                          }
                          setAnsweredQuestions((prev) => ({
                            ...prev,
                            [sq.id]: opt.correct,
                          }));
                        }}
                        className={`p-3 rounded-xl text-left text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
                          isAnswered && opt.correct
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold'
                            : isAnswered && !opt.correct
                            ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                            : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>

                  {isAnswered && (
                    <p className="text-xs text-emerald-800 font-semibold pt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{sq.explanation}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('cerita');
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← Kembali Baca Cerita
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('binaAyat');
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm cursor-pointer"
            >
              <span>Teruskan ke Bina Ayat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: BINA AYAT SENDIRI */}
      {activeTab === 'binaAyat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          {/* Step 1: Choose Idiom */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              1. Pilih Peribahasa Kebersihan:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CORE_5_IDIOMS.map((idiom) => {
                const isSelected = selectedIdiom.id === idiom.id;
                return (
                  <button
                    key={idiom.id}
                    onClick={() => {
                      sound.playPop();
                      setSelectedIdiom(idiom);
                      handleClear();
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="text-xl mb-0.5">{idiom.emoji}</div>
                    <div className="text-xs font-semibold">{idiom.phrase}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Word Bank */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              2. Blok Bantuan Perkataan (Tekan untuk susun):
            </span>
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              {selectedIdiom.wordBank.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddWord(word)}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 font-semibold text-xs text-slate-800 shadow-xs cursor-pointer transition-colors"
                >
                  + {word}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Sentence Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                3. Ayat Anda:
              </span>
              <div className="flex gap-2 text-xs">
                {selectedWordBlocks.length > 0 && (
                  <button
                    onClick={handleRemoveLastWord}
                    className="text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Padam Terakhir ⌫
                  </button>
                )}
                {sentenceText && (
                  <button
                    onClick={handleClear}
                    className="text-rose-600 hover:text-rose-800 cursor-pointer"
                  >
                    Kosongkan ✕
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={sentenceText}
              onChange={(e) => {
                setSentenceText(e.target.value);
                setSelectedWordBlocks([]);
              }}
              rows={2}
              placeholder={`Contoh: Siti seorang yang ${selectedIdiom.phrase.toLowerCase()} kerana sentiasa menyapu sampah di kelas.`}
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm font-medium outline-hidden resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleEvaluateSentence}
              disabled={!sentenceText.trim() || isEvaluating}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer ${
                sentenceText.trim() && !isEvaluating
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEvaluating ? 'Menyemak Ayat...' : 'Semak Ayat Kebersihan'}</span>
            </button>
          </div>

          {/* Evaluation Card */}
          {evaluation && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 text-emerald-950 space-y-2 text-xs sm:text-sm animate-fade-in">
              <div className="flex items-center justify-between font-bold">
                <span>{evaluation.pujian}</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white border border-emerald-200">
                  Markah: {evaluation.markah}/100
                </span>
              </div>
              <p className="text-slate-700">{evaluation.maklumBalas}</p>
              {evaluation.cadanganAyat && evaluation.status !== 'cemerlang' && (
                <p className="text-xs italic text-slate-600 border-t border-emerald-200 pt-1.5">
                  Cadangan ayat: "{evaluation.cadanganAyat}"
                </p>
              )}
            </div>
          )}

          {/* Bottom Complete Button */}
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                sound.playCorrect();
                onCompleteScreen();
              }}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs cursor-pointer"
            >
              <span>Lihat Sijil Wira Kebersihan (Skrin 6)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Clean Idiom Popup Modal */}
      {selectedIdiomModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 text-center space-y-3">
            <div className="text-4xl">{selectedIdiomModal.emoji}</div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              "{selectedIdiomModal.phrase}"
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {selectedIdiomModal.meaning}
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() =>
                  speech.speak(
                    `${selectedIdiomModal.phrase} bermaksud ${selectedIdiomModal.meaning}`
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Dengar</span>
              </button>
              <button
                onClick={() => setSelectedIdiomModal(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
