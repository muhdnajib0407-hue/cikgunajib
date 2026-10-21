import React, { useState, useEffect } from 'react';
import { Eye, Move, X, ChevronUp, ChevronDown, Palette } from 'lucide-react';
import { RulerColor } from '../types';

interface ReadingRulerProps {
  isActive: boolean;
  onClose: () => void;
  rulerColor?: RulerColor;
  onChangeColor?: (color: RulerColor) => void;
}

export const ReadingRuler: React.FC<ReadingRulerProps> = ({
  isActive,
  onClose,
  rulerColor = 'amber',
  onChangeColor,
}) => {
  const [mouseY, setMouseY] = useState(250);
  const [rulerHeight, setRulerHeight] = useState(52);
  const [activeColor, setActiveColor] = useState<RulerColor>(rulerColor);

  useEffect(() => {
    setActiveColor(rulerColor);
  }, [rulerColor]);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMouseY(e.touches[0].clientY);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setMouseY((prev) => Math.min(window.innerHeight - 40, prev + 24));
      } else if (e.key === 'ArrowUp') {
        setMouseY((prev) => Math.max(40, prev - 24));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  if (!isActive) return null;

  const topHeight = Math.max(0, mouseY - rulerHeight / 2);

  // Style configurations according to Irlen / Dyslexia Color Overlays
  const colorStyles: Record<
    RulerColor,
    { border: string; bg: string; badge: string; text: string }
  > = {
    amber: {
      border: 'border-amber-400',
      bg: 'bg-amber-300/30',
      badge: 'bg-amber-100 text-amber-950 border-amber-300',
      text: 'Kuning Krim',
    },
    blue: {
      border: 'border-sky-400',
      bg: 'bg-sky-300/30',
      badge: 'bg-sky-100 text-sky-950 border-sky-300',
      text: 'Biru Lembut',
    },
    green: {
      border: 'border-emerald-400',
      bg: 'bg-emerald-300/30',
      badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      text: 'Hijau Pudina',
    },
    gray: {
      border: 'border-slate-400',
      bg: 'bg-slate-200/40',
      badge: 'bg-slate-100 text-slate-900 border-slate-300',
      text: 'Kelabu Fokus',
    },
  };

  const currentStyle = colorStyles[activeColor] || colorStyles.amber;

  const handleCycleColor = () => {
    const list: RulerColor[] = ['amber', 'blue', 'green', 'gray'];
    const nextIdx = (list.indexOf(activeColor) + 1) % list.length;
    const nextColor = list[nextIdx];
    setActiveColor(nextColor);
    onChangeColor?.(nextColor);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 select-none no-print">
      {/* Top Dimmed Mask to hide distractions above current reading line */}
      <div
        className="absolute top-0 left-0 right-0 bg-slate-950/40 backdrop-blur-[0.3px] transition-all duration-75"
        style={{ height: `${topHeight}px` }}
      />

      {/* Clear Tinted Reading Strip (Pembaris Garis Bacaan) */}
      <div
        className={`absolute left-0 right-0 border-y-2 ${currentStyle.border} ${currentStyle.bg} transition-all duration-75 flex items-center justify-between px-4 pointer-events-auto shadow-sm`}
        style={{
          top: `${topHeight}px`,
          height: `${rulerHeight}px`,
        }}
      >
        {/* Subtle center reading guideline */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-white/60 pointer-events-none" />

        {/* Left Badge */}
        <div
          className={`relative z-10 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border shadow-xs ${currentStyle.badge}`}
        >
          <span>📏 Pembaris Disleksia</span>
          <span className="text-[10px] opacity-75 hidden sm:inline">
            ({currentStyle.text})
          </span>
        </div>

        {/* Right Controls */}
        <div className="relative z-10 flex items-center gap-1.5">
          {/* Change Color Button */}
          <button
            onClick={handleCycleColor}
            className="flex items-center gap-1 px-2 py-0.5 bg-white/95 hover:bg-white text-slate-800 rounded-md text-[10px] font-bold border border-slate-300 shadow-xs cursor-pointer transition-colors"
            title="Tukar warna lapisan penapis anti-silau (Irlen Syndrome)"
          >
            <Palette className="w-3 h-3 text-slate-600" />
            <span className="hidden sm:inline">Warna:</span>
            <span>{currentStyle.text}</span>
          </button>

          {/* Change Height Button */}
          <button
            onClick={() =>
              setRulerHeight((prev) =>
                prev === 38 ? 52 : prev === 52 ? 68 : prev === 68 ? 84 : 38
              )
            }
            className="px-2 py-0.5 bg-white/95 hover:bg-white text-slate-800 rounded-md text-[10px] font-bold border border-slate-300 shadow-xs cursor-pointer transition-colors"
            title="Ketinggian baris pembaris"
          >
            Tinggi: {rulerHeight}px
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1 bg-white/95 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-md text-xs border border-slate-300 shadow-xs cursor-pointer transition-colors"
            title="Tutup Pembaris Bacaan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Dimmed Mask to hide distractions below reading line */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-slate-950/40 backdrop-blur-[0.3px] transition-all duration-75"
        style={{ top: `${topHeight + rulerHeight}px` }}
      />
    </div>
  );
};
