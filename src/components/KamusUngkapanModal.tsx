import React, { useState } from 'react';
import { Search, Volume2, X, Sparkles, BookOpen, Filter } from 'lucide-react';
import { SIMPULAN_BAHASA_LIST } from '../data/simpulanBahasaData';
import { IdiomItem } from '../types';
import { speech } from '../utils/speech';
import { sound } from '../utils/soundEffects';

interface KamusUngkapanModalProps {
  isOpen: boolean;
  onClose: () => void;
  showSyllables: boolean;
}

export const KamusUngkapanModal: React.FC<KamusUngkapanModalProps> = ({
  isOpen,
  onClose,
  showSyllables,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedIdiom, setSelectedIdiom] = useState<IdiomItem | null>(null);

  if (!isOpen) return null;

  const categories = [
    'Semua',
    'Kebersihan',
    'Kerajinan',
    'Kerjasama',
    'Kesihatan',
    'Amalan Hidup',
    'Sifat & Perangai',
  ];

  const filteredList = SIMPULAN_BAHASA_LIST.filter((item) => {
    const matchesSearch =
      item.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.figurativeMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exampleSentence.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              📖
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight font-serif">
                Kamus Peribahasa SIMBA: Jagalah Kebersihan
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                Koleksi 20 Peribahasa & Simpulan Bahasa Kebersihan & Kerajinan Bergambar MBPK
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Tutup Kamus"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari peribahasa kebersihan (cth: ringan tulang, mandi peluh, bersih)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 bg-white text-sm sm:text-base outline-hidden font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <Filter className="w-3.5 h-3.5 text-emerald-700 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playPop();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Two panes or searchable grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {filteredList.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="font-bold text-base">Tiada simpulan bahasa dijumpai.</p>
              <p className="text-xs">Cuba cari kata kunci lain seperti "rajin", "tulang", atau "hati".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-emerald-300 hover:shadow-md transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        {showSyllables ? (
                          <div className="flex gap-1">
                            {item.syllables.map((syl, idx) => (
                              <span
                                key={idx}
                                className={`font-black text-base px-1.5 rounded ${
                                  idx % 2 === 0
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {syl}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <h4 className="font-extrabold text-base sm:text-lg text-slate-900 font-serif">
                            {item.phrase}
                          </h4>
                        )}
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sound.playPop();
                        speech.speak(
                          `${item.phrase} bermaksud ${item.figurativeMeaning}. Contoh ayat: ${item.exampleSentence}`
                        );
                      }}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                      title="Dengar bacaan"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-xs sm:text-sm">
                    <span className="font-bold text-amber-900 block mb-0.5">
                      Maksud Kiasan:
                    </span>
                    <p className="font-semibold text-slate-800">
                      "{item.figurativeMeaning}"
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-0.5">
                      Contoh Ayat:
                    </span>
                    <p className="italic leading-snug">"{item.exampleSentence}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Menunjukkan {filteredList.length} daripada 20 ungkapan</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
