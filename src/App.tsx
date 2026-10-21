/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, ThemeMode, TextSizeMode, FontMode, LetterSpacingMode, RulerColor } from './types';
import { Header } from './components/Header';
import { Screen0LamanUtama } from './components/Screen0LamanUtama';
import { Screen1Kenali } from './components/Screen1Kenali';
import { Screen2Sebut } from './components/Screen2Sebut';
import { Screen3Padankan } from './components/Screen3Padankan';
import { Screen4KuizMario } from './components/Screen4KuizMario';
import { Screen5Bercerita } from './components/Screen5Bercerita';
import { Screen6Nilai } from './components/Screen6Nilai';
import { KamusUngkapanModal } from './components/KamusUngkapanModal';
import { DashboardGuruModal } from './components/DashboardGuruModal';
import { ReadingRuler } from './components/ReadingRuler';
import { LetterConfusionModal } from './components/LetterConfusionModal';
import { DyslexiaToolbar } from './components/DyslexiaToolbar';
import { sound } from './utils/soundEffects';
import { speech } from './utils/speech';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(0);
  const [starsCollected, setStarsCollected] = useState<number>(() => {
    const saved = localStorage.getItem('simba_stars');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('simba_theme') as ThemeMode) || 'krim';
  });

  const [textSize, setTextSize] = useState<TextSizeMode>(() => {
    return (localStorage.getItem('simba_text_size') as TextSizeMode) || 'normal';
  });

  const [fontMode, setFontMode] = useState<FontMode>(() => {
    return (localStorage.getItem('simba_font_mode') as FontMode) || 'lexend';
  });

  const [showSyllables, setShowSyllables] = useState<boolean>(() => {
    return localStorage.getItem('simba_syllables') === 'true';
  });

  // Dyslexia Reading Ruler, Letter Spacing & Color Overlays
  const [isReadingRulerActive, setIsReadingRulerActive] = useState<boolean>(() => {
    return localStorage.getItem('simba_reading_ruler') === 'true';
  });

  const [rulerColor, setRulerColor] = useState<RulerColor>(() => {
    return (localStorage.getItem('simba_ruler_color') as RulerColor) || 'amber';
  });

  const [letterSpacing, setLetterSpacing] = useState<LetterSpacingMode>(() => {
    return (localStorage.getItem('simba_letter_spacing') as LetterSpacingMode) || 'normal';
  });

  const [isDyslexiaMode, setIsDyslexiaMode] = useState<boolean>(() => {
    return localStorage.getItem('simba_dyslexia_mode') === 'true';
  });

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState(false);
  const [isLetterConfusionOpen, setIsLetterConfusionOpen] = useState(false);

  // Sync theme attribute to document body for background & accessibility
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('simba_theme', theme);
  }, [theme]);

  // Sync mute state with sound manager
  useEffect(() => {
    sound.setMuted(isMuted);
  }, [isMuted]);

  // Sync font mode to root
  useEffect(() => {
    localStorage.setItem('simba_font_mode', fontMode);
    if (fontMode === 'comic') {
      document.body.style.fontFamily = "'Comic Neue', 'Fredoka', cursive";
    } else if (fontMode === 'opendyslexic') {
      document.body.style.fontFamily = "'OpenDyslexic', 'Lexend', sans-serif";
    } else if (fontMode === 'sans') {
      document.body.style.fontFamily = "system-ui, -apple-system, sans-serif";
    } else {
      document.body.style.fontFamily = "'Lexend', sans-serif";
    }
  }, [fontMode]);

  // Sync reading ruler state & color
  useEffect(() => {
    localStorage.setItem('simba_reading_ruler', String(isReadingRulerActive));
  }, [isReadingRulerActive]);

  useEffect(() => {
    localStorage.setItem('simba_ruler_color', rulerColor);
  }, [rulerColor]);

  // Sync letter spacing
  useEffect(() => {
    localStorage.setItem('simba_letter_spacing', letterSpacing);
  }, [letterSpacing]);

  // Sync dyslexia mode
  useEffect(() => {
    localStorage.setItem('simba_dyslexia_mode', String(isDyslexiaMode));
  }, [isDyslexiaMode]);

  const handleAddStars = (amount: number) => {
    setStarsCollected((prev) => {
      const next = prev + amount;
      localStorage.setItem('simba_stars', next.toString());
      return next;
    });
  };

  const handleResetAll = () => {
    setStarsCollected(0);
    localStorage.removeItem('simba_stars');
    setCurrentScreen(0);
  };

  const handleToggleSyllables = () => {
    sound.playPop();
    setShowSyllables((prev) => {
      const next = !prev;
      localStorage.setItem('simba_syllables', String(next));
      return next;
    });
  };

  // Master One-Click Dyslexia Mode Toggle
  const handleToggleDyslexiaMode = () => {
    sound.playPop();
    setIsDyslexiaMode((prev) => {
      const next = !prev;
      if (next) {
        setShowSyllables(true);
        localStorage.setItem('simba_syllables', 'true');
        setFontMode('lexend');
        setTheme('krim');
        setLetterSpacing('wide');
        setIsReadingRulerActive(true);
        speech.setRate(0.72);
        speech.speak(
          'Mod Disleksia diaktifkan. Suku kata berwarna, fon Lexend, pembaris bacaan, dan kelajuan suara perlahan sedia digunakan.'
        );
      } else {
        setShowSyllables(false);
        localStorage.setItem('simba_syllables', 'false');
        setLetterSpacing('normal');
        setIsReadingRulerActive(false);
        speech.setRate(0.85);
      }
      return next;
    });
  };

  // Compute text size container class
  const textSizeClass = {
    normal: 'text-base',
    large: 'text-lg [&_h2]:text-4xl [&_p]:text-lg',
    xlarge: 'text-xl [&_h2]:text-5xl [&_p]:text-xl font-medium',
  }[textSize];

  // Letter spacing class for visual crowding reduction
  const letterSpacingClass =
    letterSpacing === 'extra'
      ? 'letter-spacing-extra tracking-widest leading-loose'
      : letterSpacing === 'wide'
      ? 'letter-spacing-wide tracking-wider leading-relaxed'
      : '';

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${textSizeClass} ${letterSpacingClass}`}>
      {/* Dyslexia Reading Ruler (Tracks mouse/finger line by line with Irlen color filters) */}
      <ReadingRuler
        isActive={isReadingRulerActive}
        onClose={() => setIsReadingRulerActive(false)}
        rulerColor={rulerColor}
        onChangeColor={setRulerColor}
      />

      {/* Accessible Header with Direct Dyslexia Controls */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        starsCollected={starsCollected}
        theme={theme}
        onThemeChange={setTheme}
        textSize={textSize}
        onTextSizeChange={(size) => {
          setTextSize(size);
          localStorage.setItem('simba_text_size', size);
        }}
        fontMode={fontMode}
        onFontModeChange={setFontMode}
        showSyllables={showSyllables}
        onToggleSyllables={handleToggleSyllables}
        isDyslexiaMode={isDyslexiaMode}
        onToggleDyslexiaMode={handleToggleDyslexiaMode}
        isReadingRulerActive={isReadingRulerActive}
        onToggleReadingRuler={() => setIsReadingRulerActive((prev) => !prev)}
        letterSpacing={letterSpacing}
        onLetterSpacingChange={setLetterSpacing}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
        onOpenLetterConfusionModal={() => setIsLetterConfusionOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentScreen === 0 && (
          <Screen0LamanUtama
            onStartActivity={() => setCurrentScreen(1)}
            showSyllables={showSyllables}
          />
        )}

        {currentScreen === 1 && (
          <Screen1Kenali
            onCompleteScreen={() => setCurrentScreen(2)}
            showSyllables={showSyllables}
            onBackToHome={() => setCurrentScreen(0)}
          />
        )}

        {currentScreen === 2 && (
          <Screen2Sebut
            onCompleteScreen={() => setCurrentScreen(3)}
            onAddStars={handleAddStars}
          />
        )}

        {currentScreen === 3 && (
          <Screen3Padankan
            onCompleteScreen={() => setCurrentScreen(4)}
            onAddStars={handleAddStars}
            showSyllables={showSyllables}
          />
        )}

        {currentScreen === 4 && (
          <Screen4KuizMario
            onCompleteScreen={() => setCurrentScreen(5)}
            onAddStars={handleAddStars}
          />
        )}

        {currentScreen === 5 && (
          <Screen5Bercerita
            onCompleteScreen={() => setCurrentScreen(6)}
            onAddStars={handleAddStars}
            showSyllables={showSyllables}
          />
        )}

        {currentScreen === 6 && (
          <Screen6Nilai
            starsCollected={starsCollected}
            onResetAll={handleResetAll}
            onJumpToScreen={(s) => setCurrentScreen(s)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white/90 border-t border-slate-200/80 py-3.5 px-4 text-center text-xs text-slate-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span>🦁 SIMBA: Jagalah Kebersihan</span>
            <span className="text-slate-300">·</span>
            <span>Peribahasa Interaktif Murid Berkeperluan Khas (MBPK)</span>
          </div>
          <div className="flex items-center gap-3 font-semibold text-slate-500">
            <span className="text-emerald-700 font-bold">✨ Mesra Disleksia & Autisme</span>
            <span>•</span>
            <button
              onClick={() => setIsTeacherDashboardOpen(true)}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Panduan Guru & DSKP
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Accessibility Floating Tools */}
      <KamusUngkapanModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        showSyllables={showSyllables}
      />

      <DashboardGuruModal
        isOpen={isTeacherDashboardOpen}
        onClose={() => setIsTeacherDashboardOpen(false)}
        starsCollected={starsCollected}
      />

      <LetterConfusionModal
        isOpen={isLetterConfusionOpen}
        onClose={() => setIsLetterConfusionOpen(false)}
      />

      {/* Persistent Floating Dyslexia Accessibility Toolbar */}
      <DyslexiaToolbar
        isDyslexiaMode={isDyslexiaMode}
        onToggleDyslexiaMode={handleToggleDyslexiaMode}
        showSyllables={showSyllables}
        onToggleSyllables={handleToggleSyllables}
        isReadingRulerActive={isReadingRulerActive}
        onToggleReadingRuler={() => setIsReadingRulerActive((prev) => !prev)}
        rulerColor={rulerColor}
        onChangeRulerColor={setRulerColor}
        letterSpacing={letterSpacing}
        onLetterSpacingChange={setLetterSpacing}
        fontMode={fontMode}
        onFontModeChange={setFontMode}
        textSize={textSize}
        onTextSizeChange={setTextSize}
        theme={theme}
        onThemeChange={setTheme}
        onOpenLetterConfusionModal={() => setIsLetterConfusionOpen(true)}
      />
    </div>
  );
}
