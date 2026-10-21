export type ThemeMode = 'krim' | 'biru' | 'hijau' | 'kontras';
export type TextSizeMode = 'normal' | 'large' | 'xlarge';
export type FontMode = 'lexend' | 'opendyslexic' | 'comic' | 'sans';
export type LetterSpacingMode = 'normal' | 'wide' | 'extra';
export type RulerColor = 'amber' | 'blue' | 'green' | 'gray';
export type ScreenId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface StudentProfile {
  name: string;
  className: string;
  avatar: string;
}

export interface IdiomItem {
  id: string;
  phrase: string;
  syllables: string[]; // e.g. ['u', 'lat', 'bu', 'ku']
  literalMeaning: string; // Maksud harfiah
  figurativeMeaning: string; // Maksud kiasan sebenar
  explanation: string; // Penjelasan mesra kanak-kanak
  exampleSentence: string;
  sentenceSyllables?: string[];
  category: 'Kebersihan' | 'Kerajinan' | 'Kerjasama' | 'Amalan Hidup' | 'Sifat & Perangai' | 'Kesihatan';
  emoji: string;
  imageUrl?: string;
  themeColor: string; // Tailwind color accent
  wordBank: string[]; // Cadangan perkataan untuk bina ayat
}

export interface QuizQuestion {
  id: number;
  question: string;
  idiom: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
    emoji: string;
  }[];
  hint: string;
}

export interface MatchingPair {
  id: string;
  phrase: string;
  meaning: string;
  emoji: string;
}

export interface SentenceEvaluation {
  status: 'cemerlang' | 'baik' | 'bimbingan';
  markah: number;
  pujian: string;
  maklumBalas: string;
  cadanganAyat: string;
  kriteria?: {
    adaSimpulanBahasa: boolean;
    panjangMencukupi: boolean;
    konteksSesuai: boolean;
  };
}

export interface StudentProgress {
  studentName: string;
  screenProgress: Record<ScreenId, boolean>;
  starsCollected: number;
  quizzesCompleted: number;
  matchScore: number;
  sentencesBuilt: number;
  lastActive: string;
  masteredIdioms: string[];
}
