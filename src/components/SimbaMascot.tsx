import React from 'react';
import { Volume2 } from 'lucide-react';
import { speech } from '../utils/speech';

interface SimbaMascotProps {
  mood?: 'happy' | 'thinking' | 'cheering' | 'talking';
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SimbaMascot: React.FC<SimbaMascotProps> = ({
  mood = 'happy',
  speechText,
  size = 'md',
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const handleSpeakSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!speechText) return;
    setIsSpeaking(true);
    speech.speak(speechText, {
      onEnd: () => setIsSpeaking(false),
    });
  };

  const sizeDimensions = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
  }[size];

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* SVG Lion Mascot */}
      <div
        className={`relative ${sizeDimensions} shrink-0 transition-transform duration-300 hover:scale-105 select-none`}
        title="Simba - Sahabat Belajar Anda"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Lion Mane */}
          <circle cx="50" cy="52" r="38" fill="#F97316" />
          <circle cx="50" cy="52" r="36" fill="#FB923C" />
          {/* Mane curls */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <circle
              key={i}
              cx={50 + 38 * Math.cos((angle * Math.PI) / 180)}
              cy={52 + 38 * Math.sin((angle * Math.PI) / 180)}
              r="11"
              fill="#EA580C"
            />
          ))}

          {/* Lion Head */}
          <circle cx="50" cy="52" r="30" fill="#FDE047" />

          {/* Ears */}
          <circle cx="28" cy="28" r="10" fill="#EA580C" />
          <circle cx="28" cy="28" r="6" fill="#FDE047" />
          <circle cx="72" cy="28" r="10" fill="#EA580C" />
          <circle cx="72" cy="28" r="6" fill="#FDE047" />

          {/* Cheerful Hat / Songkok / Scholar cap */}
          <path
            d="M 32 24 L 68 24 L 64 12 L 36 12 Z"
            fill="#1E3A8A"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
          <circle cx="50" cy="11" r="3" fill="#F59E0B" />
          <path d="M 50 11 L 62 16" stroke="#F59E0B" strokeWidth="1.5" />

          {/* Eyes */}
          {mood === 'cheering' ? (
            <>
              {/* Happy squint eyes */}
              <path
                d="M 37 48 Q 42 42 47 48"
                stroke="#1F2937"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 53 48 Q 58 42 63 48"
                stroke="#1F2937"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
              {/* Big sparkly eyes */}
              <circle cx="41" cy="48" r="5" fill="#1F2937" />
              <circle cx="43" cy="46" r="2" fill="#FFFFFF" />
              <circle cx="59" cy="48" r="5" fill="#1F2937" />
              <circle cx="61" cy="46" r="2" fill="#FFFFFF" />
            </>
          )}

          {/* Cheeks blush */}
          <circle cx="33" cy="56" r="4.5" fill="#FDA4AF" opacity="0.8" />
          <circle cx="67" cy="56" r="4.5" fill="#FDA4AF" opacity="0.8" />

          {/* Snout and Nose */}
          <ellipse cx="50" cy="58" rx="10" ry="7" fill="#FEF08A" />
          <path
            d="M 46 54 L 54 54 L 50 58 Z"
            fill="#B91C1C"
          />

          {/* Mouth */}
          {mood === 'cheering' || mood === 'talking' ? (
            <path
              d="M 45 61 Q 50 68 55 61"
              stroke="#B91C1C"
              strokeWidth="2.5"
              fill="#EF4444"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 46 60 Q 50 64 54 60"
              stroke="#78350F"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Whiskers */}
          <line x1="28" y1="56" x2="20" y2="55" stroke="#78350F" strokeWidth="1.5" />
          <line x1="28" y1="60" x2="20" y2="62" stroke="#78350F" strokeWidth="1.5" />
          <line x1="72" y1="56" x2="80" y2="55" stroke="#78350F" strokeWidth="1.5" />
          <line x1="72" y1="60" x2="80" y2="62" stroke="#78350F" strokeWidth="1.5" />
        </svg>

        {/* Small pulsing ring when speaking */}
        {isSpeaking && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
          </span>
        )}
      </div>

      {/* Speech Bubble */}
      {speechText && (
        <div className="relative bg-white border-2 border-amber-300 rounded-2xl px-4 py-2.5 shadow-sm max-w-xs md:max-w-md animate-fade-in">
          {/* Arrow pointing to mascot */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-amber-300"></div>
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-white"></div>

          <div className="flex items-start gap-2">
            <p className="text-sm md:text-base font-medium text-slate-800 leading-snug">
              {speechText}
            </p>
            <button
              onClick={handleSpeakSpeech}
              title="Dengar suara Simba"
              aria-label="Dengar suara Simba"
              className="p-1 rounded-full text-amber-600 hover:bg-amber-100 transition-colors shrink-0"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
