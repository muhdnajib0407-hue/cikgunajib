import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  ArrowRight,
  RotateCcw,
  Trophy,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { QUIZ_QUESTIONS, CORE_5_IDIOMS } from '../data/simpulanBahasaData';
import { QuizQuestion } from '../types';
import { speech } from '../utils/speech';
import { sound } from '../utils/soundEffects';

interface Screen4KuizMarioProps {
  onCompleteScreen: () => void;
  onAddStars: (amount: number) => void;
}

interface RevealedIdiomPopup {
  idiom: string;
  emoji: string;
  meaning: string;
  question: QuizQuestion;
}

interface DustParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  vx: number;
  vy: number;
}

interface BlockBounce {
  id: number;
  offsetY: number;
  vy: number;
}

export const Screen4KuizMario: React.FC<Screen4KuizMarioProps> = ({
  onCompleteScreen,
  onAddStars,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [trashCleaned, setTrashCleaned] = useState(0);
  const [activeRevealedIdiom, setActiveRevealedIdiom] = useState<RevealedIdiomPopup | null>(null);
  const [completedBlocks, setCompletedBlocks] = useState<number[]>([]);
  const [unlockedIdioms, setUnlockedIdioms] = useState<string[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; correct: boolean } | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [showGuidedPointers, setShowGuidedPointers] = useState(true);

  const keysPressed = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  const pState = useRef({
    x: 60,
    y: 240,
    vx: 0,
    vy: 0,
    isGrounded: true,
    facing: 'right' as 'left' | 'right',
    runFrame: 0,
    isJumping: false,
  });

  const dustParticles = useRef<DustParticle[]>([]);
  const blockBounces = useRef<Record<number, number>>({});
  const lastMoveTime = useRef<number>(Date.now());

  const WORLD_WIDTH = 1600;
  const GROUND_Y = 280;

  const questionBlocks = useRef([
    { id: 1, x: 260, y: 170, width: 48, height: 48, qIndex: 0 },
    { id: 2, x: 540, y: 150, width: 48, height: 48, qIndex: 1 },
    { id: 3, x: 820, y: 160, width: 48, height: 48, qIndex: 2 },
    { id: 4, x: 1100, y: 140, width: 48, height: 48, qIndex: 3 },
    { id: 5, x: 1380, y: 160, width: 48, height: 48, qIndex: 4 },
  ]);

  const platforms = useRef([
    { x: 220, y: 170, width: 130, height: 18 },
    { x: 500, y: 150, width: 130, height: 18 },
    { x: 780, y: 160, width: 130, height: 18 },
    { x: 1060, y: 140, width: 130, height: 18 },
    { x: 1340, y: 160, width: 130, height: 18 },
  ]);

  const collectibleTrash = useRef([
    { id: 1, x: 160, y: 245, collected: false, emoji: '🥫', name: 'Tin' },
    { id: 2, x: 400, y: 245, collected: false, emoji: '🧴', name: 'Botol' },
    { id: 3, x: 670, y: 245, collected: false, emoji: '📄', name: 'Kertas' },
    { id: 4, x: 950, y: 245, collected: false, emoji: '🍂', name: 'Daun Kering' },
    { id: 5, x: 1220, y: 245, collected: false, emoji: '🥤', name: 'Cawan Plastik' },
    { id: 6, x: 1470, y: 245, collected: false, emoji: '📦', name: 'Kotak' },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeRevealedIdiom) return;
      lastMoveTime.current = Date.now();
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysPressed.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysPressed.current.right = true;
      if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w' || e.key === 'W') {
        if (pState.current.isGrounded) {
          pState.current.vy = -13.0;
          pState.current.isGrounded = false;
          pState.current.isJumping = true;
          sound.playJump();

          // Spawn jump dust
          for (let i = 0; i < 6; i++) {
            dustParticles.current.push({
              x: pState.current.x + 20,
              y: pState.current.y + 36,
              radius: Math.random() * 4 + 2,
              alpha: 0.8,
              vx: (Math.random() - 0.5) * 3,
              vy: -Math.random() * 2,
            });
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysPressed.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysPressed.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeRevealedIdiom]);

  const handleTouchLeftStart = () => {
    lastMoveTime.current = Date.now();
    keysPressed.current.left = true;
  };
  const handleTouchLeftEnd = () => {
    keysPressed.current.left = false;
  };
  const handleTouchRightStart = () => {
    lastMoveTime.current = Date.now();
    keysPressed.current.right = true;
  };
  const handleTouchRightEnd = () => {
    keysPressed.current.right = false;
  };
  const handleTouchJump = () => {
    lastMoveTime.current = Date.now();
    if (pState.current.isGrounded && !activeRevealedIdiom) {
      pState.current.vy = -13.0;
      pState.current.isGrounded = false;
      pState.current.isJumping = true;
      sound.playJump();

      for (let i = 0; i < 6; i++) {
        dustParticles.current.push({
          x: pState.current.x + 20,
          y: pState.current.y + 36,
          radius: Math.random() * 4 + 2,
          alpha: 0.8,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 2,
        });
      }
    }
  };

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update character physics
      if (!activeRevealedIdiom && !gameWon) {
        const p = pState.current;

        if (keysPressed.current.left) {
          p.vx = -5.0;
          p.facing = 'left';
          p.runFrame += dt * 12;
          lastMoveTime.current = Date.now();
        } else if (keysPressed.current.right) {
          p.vx = 5.0;
          p.facing = 'right';
          p.runFrame += dt * 12;
          lastMoveTime.current = Date.now();
        } else {
          p.vx *= 0.72;
        }

        // Gravity
        p.vy += 0.68;
        if (p.vy > 12.5) p.vy = 12.5;

        p.x += p.vx;
        p.y += p.vy;

        // Run dust
        if (Math.abs(p.vx) > 2 && p.isGrounded && Math.random() < 0.25) {
          dustParticles.current.push({
            x: p.facing === 'right' ? p.x + 5 : p.x + 35,
            y: p.y + 36,
            radius: Math.random() * 3 + 1.5,
            alpha: 0.6,
            vx: -p.vx * 0.2,
            vy: -0.5,
          });
        }

        // Bounds
        if (p.x < 10) p.x = 10;
        if (p.x > WORLD_WIDTH - 50) p.x = WORLD_WIDTH - 50;

        // Ground Collision
        if (p.y >= GROUND_Y) {
          p.y = GROUND_Y;
          p.vy = 0;
          p.isGrounded = true;
          p.isJumping = false;
        }

        // Platform Collisions (Stand on top)
        platforms.current.forEach((plat) => {
          if (
            p.x + 36 > plat.x &&
            p.x < plat.x + plat.width &&
            p.y + 40 >= plat.y &&
            p.y + 40 <= plat.y + 14 &&
            p.vy >= 0
          ) {
            p.y = plat.y - 40;
            p.vy = 0;
            p.isGrounded = true;
            p.isJumping = false;
          }
        });

        // Question Block Head-Hit Collision (Hit from below)
        questionBlocks.current.forEach((block) => {
          if (
            p.x + 36 > block.x &&
            p.x < block.x + block.width &&
            p.y <= block.y + block.height &&
            p.y >= block.y &&
            p.vy < 0
          ) {
            // Hit block from bottom!
            p.vy = 3.5;
            p.y = block.y + block.height + 2;

            // Trigger bounce
            blockBounces.current[block.id] = -8;

            if (!completedBlocks.includes(block.id)) {
              sound.playCorrect();
              const q = QUIZ_QUESTIONS[block.qIndex];
              const idiom = CORE_5_IDIOMS[block.qIndex];

              setActiveRevealedIdiom({
                idiom: idiom.phrase,
                emoji: idiom.emoji,
                meaning: idiom.figurativeMeaning,
                question: q,
              });

              speech.speak(`Kotak terbuka! ${idiom.phrase}. Maksud: ${idiom.figurativeMeaning}`);
            } else {
              sound.playPop();
            }
          }
        });

        // Collectible Trash Hit
        collectibleTrash.current.forEach((trash) => {
          if (!trash.collected) {
            const dist = Math.hypot(p.x + 20 - trash.x, p.y + 20 - trash.y);
            if (dist < 32) {
              trash.collected = true;
              sound.playCorrect();
              setTrashCleaned((prev) => prev + 1);
              onAddStars(1);
              speech.speak(`Bagus! Kutip ${trash.name}`);
            }
          }
        });

        // Goal reached
        if (completedBlocks.length === 5 && p.x >= 1450 && !gameWon) {
          setGameWon(true);
          sound.playWin();
          onAddStars(5);
          speech.speak('Tahniah! Anda telah berjaya membersihkan taman dan membuka semua peribahasa!');
          try {
            confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
          } catch (e) {}
        }
      }

      // Update block bounces
      Object.keys(blockBounces.current).forEach((k) => {
        const id = Number(k);
        let val = blockBounces.current[id];
        if (val < 0) {
          val += dt * 30;
          if (val > 0) val = 0;
          blockBounces.current[id] = val;
        }
      });

      // Update dust particles
      dustParticles.current.forEach((dp) => {
        dp.x += dp.vx;
        dp.y += dp.vy;
        dp.alpha -= dt * 1.8;
      });
      dustParticles.current = dustParticles.current.filter((dp) => dp.alpha > 0.05);

      // Render World
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cameraX = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, pState.current.x - 260));

      ctx.save();
      ctx.translate(-cameraX, 0);

      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#bae6fd');
      skyGrad.addColorStop(0.6, '#e0f2fe');
      skyGrad.addColorStop(1, '#f0fdf4');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(cameraX, 0, canvas.width, canvas.height);

      // Sun
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cameraX + canvas.width - 90, 60, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Distant rolling hills
      ctx.fillStyle = '#bbf7d0';
      [150, 480, 850, 1200, 1550].forEach((hx, idx) => {
        ctx.beginPath();
        ctx.arc(hx, 320, 150 + (idx % 2) * 20, Math.PI, 0);
        ctx.fill();
      });

      // Trees in background
      [100, 320, 640, 920, 1280].forEach((tx) => {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(tx + 12, GROUND_Y - 30, 10, 30);
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(tx + 17, GROUND_Y - 45, 24, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ground
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, GROUND_Y + 38, WORLD_WIDTH, 100);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, GROUND_Y + 38, WORLD_WIDTH, 12);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, GROUND_Y + 50, WORLD_WIDTH, 90);

      // Platforms (Wood planks)
      platforms.current.forEach((plat) => {
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 6);
        ctx.fill();
        ctx.fillStyle = '#b45309';
        ctx.fillRect(plat.x + 4, plat.y + 2, plat.width - 8, 4);
      });

      // Question Blocks
      questionBlocks.current.forEach((b) => {
        const isHit = completedBlocks.includes(b.id);
        const bounceY = blockBounces.current[b.id] || 0;
        const by = b.y + bounceY;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        ctx.fillStyle = isHit ? '#10b981' : '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(b.x, by, b.width, b.height, 10);
        ctx.fill();

        ctx.strokeStyle = isHit ? '#047857' : '#b45309';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Question mark or Checkmark
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(isHit ? '✓' : '?', b.x + b.width / 2, by + b.height / 2);

        // Guided Animated Hint above unhit block
        if (showGuidedPointers && !isHit) {
          const pulse = (Math.sin(time * 0.006 + b.id) + 1) / 2;
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 11px Fredoka, sans-serif';
          ctx.fillText('⬆️ LOMPAT!', b.x + b.width / 2, by - 16 - pulse * 5);
        }

        ctx.restore();
      });

      // Collectible Trash Items
      collectibleTrash.current.forEach((t) => {
        if (!t.collected) {
          const bob = Math.sin(time * 0.005 + t.id) * 3;
          ctx.save();
          ctx.font = '22px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(t.emoji, t.x, t.y + bob);

          // Sparkle above trash
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText('✨', t.x + 12, t.y - 12 + bob);
          ctx.restore();
        }
      });

      // Goal: Clean Park Recycle Station
      const goalX = 1450;
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.roundRect(goalX, GROUND_Y - 95, 110, 135, 12);
      ctx.fill();
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(goalX + 10, GROUND_Y - 85, 90, 24, 6);
      ctx.fill();

      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 10.5px Lexend, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('♻️ TAMAN BERSIH', goalX + 55, GROUND_Y - 69);

      ctx.font = '36px sans-serif';
      ctx.fillText('🦁', goalX + 55, GROUND_Y - 15);

      // Dust Particles
      dustParticles.current.forEach((dp) => {
        ctx.save();
        ctx.globalAlpha = dp.alpha;
        ctx.fillStyle = '#d1d5db';
        ctx.beginPath();
        ctx.arc(dp.x, dp.y, dp.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Simba Player Rendering (Cute Animated Lion Cub!)
      const px = pState.current.x;
      const py = pState.current.y;
      const isFacingRight = pState.current.facing === 'right';

      ctx.save();
      ctx.translate(px + 20, py + 20);
      if (!isFacingRight) {
        ctx.scale(-1, 1);
      }

      // Tail
      const tailWag = Math.sin(time * 0.008) * 0.4;
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-14, 8);
      ctx.quadraticCurveTo(-26, 4 + tailWag * 10, -22, -6 + tailWag * 12);
      ctx.stroke();

      // Tail Puff
      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.arc(-22, -6 + tailWag * 12, 5, 0, Math.PI * 2);
      ctx.fill();

      // Body (Legs cycle when running)
      const legOffset = pState.current.isGrounded ? Math.sin(pState.current.runFrame) * 4 : 0;

      // Back leg
      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.roundRect(-8, 8 - legOffset, 6, 12, 3);
      ctx.fill();

      // Front leg
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.roundRect(4, 8 + legOffset, 6, 12, 3);
      ctx.fill();

      // Mane (Fluffy Orange)
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(0, -2, 19, 0, Math.PI * 2);
      ctx.fill();

      // Head / Face
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(2, -2, 13, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(-7, -14, 5, 0, Math.PI * 2);
      ctx.arc(9, -14, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fca5a5';
      ctx.beginPath();
      ctx.arc(-7, -14, 2.5, 0, Math.PI * 2);
      ctx.arc(9, -14, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(5, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Eye shine
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6, -5, 1, 0, Math.PI * 2);
      ctx.fill();

      // Nose & Mouth
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(9, -1, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Idle movement guide
      const idleTime = Date.now() - lastMoveTime.current;
      if (idleTime > 3000 && showGuidedPointers && !gameWon) {
        ctx.save();
        const pulse = (Math.sin(time * 0.005) + 1) / 2;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(px - 40, py - 35, 120, 24, 8);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Lexend, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('👉 Tekan ➡️ ke Kanan!', px + 20, py - 20);
        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeRevealedIdiom, completedBlocks, gameWon, showGuidedPointers]);

  const handleSelectOption = (optionId: string, isCorrect: boolean, feedback: string) => {
    setSelectedOptionId(optionId);

    if (isCorrect) {
      sound.playCorrect();
      setFeedbackMsg({ text: `🌟 ${feedback}`, correct: true });
      onAddStars(2);

      if (activeRevealedIdiom) {
        const qIndex = QUIZ_QUESTIONS.findIndex(
          (q) => q.id === activeRevealedIdiom.question.id
        );
        const block = questionBlocks.current[qIndex];
        if (block && !completedBlocks.includes(block.id)) {
          setCompletedBlocks((prev) => [...prev, block.id]);
          setUnlockedIdioms((prev) => [...prev, activeRevealedIdiom.idiom]);
        }
      }
    } else {
      sound.playTryAgain();
      setFeedbackMsg({ text: `💡 ${feedback}`, correct: false });
    }
  };

  const handleCloseRevealedModal = () => {
    sound.playPop();
    setActiveRevealedIdiom(null);
    setSelectedOptionId(null);
    setFeedbackMsg(null);
  };

  const handleRestartGame = () => {
    sound.playPop();
    pState.current = {
      x: 60,
      y: 240,
      vx: 0,
      vy: 0,
      isGrounded: true,
      facing: 'right',
      runFrame: 0,
      isJumping: false,
    };
    setCompletedBlocks([]);
    setUnlockedIdioms([]);
    setTrashCleaned(0);
    setGameWon(false);
    setActiveRevealedIdiom(null);
    collectibleTrash.current.forEach((t) => (t.collected = false));
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 animate-fade-in space-y-5">
      {/* Clean Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Aktiviti 4 daripada 6 • Kembara Simba
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Kembara Simba
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Bantu watak Simba melompat menghentak kotak tanda soal [ ? ] untuk mengutip sampah dan membuka peribahasa!
          </p>
        </div>

        {/* Clean Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 shadow-xs">
            📦 Kotak: {completedBlocks.length} / 5
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-xs">
            ♻️ Sampah: {trashCleaned} / 6
          </span>
          <button
            onClick={() => setShowGuidedPointers((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
              showGuidedPointers
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
            title="Tunjuk / Sembunyi Petunjuk Bergerak"
          >
            {showGuidedPointers ? '💡 Petunjuk: Hidup' : '💡 Petunjuk: Mati'}
          </button>
        </div>
      </div>

      {/* Main Game Canvas */}
      <div className="relative bg-sky-100 rounded-3xl border border-slate-300 overflow-hidden shadow-md aspect-16/9 max-h-[440px]">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-full block" />

        {/* Victory Screen */}
        {gameWon && (
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in space-y-3">
            <div className="text-5xl animate-bounce">🏆🦁</div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-amber-300">
              Tahniah! Anda Wira Kebersihan Sejati!
            </h2>
            <p className="max-w-md text-xs sm:text-sm text-slate-200">
              Semua 5 kotak peribahasa dibuka dan taman telah bersih sepenuhnya!
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleRestartGame}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs cursor-pointer"
              >
                Main Semula
              </button>
              <button
                onClick={() => {
                  sound.playCorrect();
                  onCompleteScreen();
                }}
                className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Teruskan ke Modul Bercerita (Skrin 5)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch Controller with High Tactile Feel */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2">
          <button
            onMouseDown={handleTouchLeftStart}
            onMouseUp={handleTouchLeftEnd}
            onTouchStart={handleTouchLeftStart}
            onTouchEnd={handleTouchLeftEnd}
            className="w-13 h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-emerald-100 active:scale-95 border border-slate-300 flex items-center justify-center text-2xl font-bold cursor-pointer shadow-xs transition-transform"
            title="Kiri"
          >
            ⬅️
          </button>
          <button
            onMouseDown={handleTouchRightStart}
            onMouseUp={handleTouchRightEnd}
            onTouchStart={handleTouchRightStart}
            onTouchEnd={handleTouchRightEnd}
            className="w-13 h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-emerald-100 active:scale-95 border border-slate-300 flex items-center justify-center text-2xl font-bold cursor-pointer shadow-xs transition-transform"
            title="Kanan"
          >
            ➡️
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline font-medium">
          ⌨️ Gunakan anak panah papan kekunci (Kiri, Kanan, Atas) atau butang sentuh
        </span>

        <button
          onClick={handleTouchJump}
          className="px-7 h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md active:scale-95 cursor-pointer flex items-center gap-2 transition-transform"
        >
          <span>Lompat</span>
          <span className="text-lg">⬆️</span>
        </button>
      </div>

      {/* Clean Unlocked Peribahasa Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {CORE_5_IDIOMS.map((idiom, idx) => {
            const isUnlocked = unlockedIdioms.includes(idiom.phrase);
            return (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isUnlocked
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isUnlocked ? `✓ ${idiom.phrase}` : `Kotak ${idx + 1}`}
              </span>
            );
          })}
        </div>

        <button
          onClick={() => {
            sound.playCorrect();
            onCompleteScreen();
          }}
          className="flex items-center gap-1 font-bold text-emerald-800 hover:underline cursor-pointer"
        >
          <span>Langkau / Terus ke Skrin 5</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Clean Mystery Box Reveal Modal */}
      {activeRevealedIdiom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                ✨ Kotak Peribahasa Terbuka!
              </span>
              <div className="text-4xl my-1">{activeRevealedIdiom.emoji}</div>
              <h3 className="text-2xl font-black text-slate-900 font-serif">
                "{activeRevealedIdiom.idiom}"
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Maksud: {activeRevealedIdiom.meaning}
              </p>
              <button
                onClick={() =>
                  speech.speak(
                    `${activeRevealedIdiom.idiom}. Maksud: ${activeRevealedIdiom.meaning}`
                  )
                }
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline pt-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Dengar Sebutan</span>
              </button>
            </div>

            {/* Quiz Question */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 text-xs sm:text-sm">
                  {activeRevealedIdiom.question.question}
                </p>
                <button
                  onClick={() => speech.speak(activeRevealedIdiom.question.question)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Dengar Soalan"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                </button>
              </div>

              <div className="space-y-1.5">
                {activeRevealedIdiom.question.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id, opt.isCorrect, opt.feedback)}
                      className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                        isSelected && opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                          : isSelected && !opt.isCorrect
                          ? 'bg-rose-50 border-rose-300 text-rose-950'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span>{opt.emoji}</span>
                      <span className="flex-1">{opt.text}</span>
                      {isSelected && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {feedbackMsg && (
              <div
                className={`p-2.5 rounded-xl border text-xs font-semibold ${
                  feedbackMsg.correct
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {feedbackMsg.text}
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={handleCloseRevealedModal}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs transition-colors"
              >
                Teruskan Kembara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
