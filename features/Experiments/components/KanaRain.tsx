'use client';
import { useEffect, useState, useRef } from 'react';
import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useClick } from '@/shared/hooks/useAudio';
import { allKana } from '../data/kanaData';

interface RainDrop {
  id: number;
  column: number;
  kana: string;
  romanji: string;
  speed: number;
  opacity: number;
}

const COLUMNS = 20;

const KanaRain = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [drops, setDrops] = useState<RainDrop[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { playClick } = useClick();
  const router = useRouter();
  const idCounter = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Create initial drops
    const initial: RainDrop[] = [];
    for (let i = 0; i < 40; i++) {
      const kana = allKana[Math.floor(Math.random() * allKana.length)];
      initial.push({
        id: idCounter.current++,
        column: Math.floor(Math.random() * COLUMNS),
        kana: kana.kana,
        romanji: kana.romanji,
        speed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    setDrops(initial);

    // Add new drops
    const interval = setInterval(() => {
      const kana = allKana[Math.floor(Math.random() * allKana.length)];
      setDrops(prev => {
        const newDrop: RainDrop = {
          id: idCounter.current++,
          column: Math.floor(Math.random() * COLUMNS),
          kana: kana.kana,
          romanji: kana.romanji,
          speed: Math.random() * 3 + 2,
          opacity: Math.random() * 0.5 + 0.3
        };
        const updated = [...prev, newDrop];
        if (updated.length > 60) {
          return updated.slice(-60);
        }
        return updated;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isMounted]);

  const handleClose = () => {
    playClick();
    router.push('/');
  };

  if (!isMounted) return null;

  return (
    <div className='relative min-h-[100dvh] max-w-[100dvw] overflow-hidden bg-[var(--background-color)]'>
      {/* Rain drops */}
      {drops.map(drop => (
        <div
          key={drop.id}
          className='absolute text-2xl md:text-3xl cursor-default select-none'
          style={{
            left: `${(drop.column / COLUMNS) * 100 + 2.5}%`,
            opacity: hoveredId === drop.id ? 1 : drop.opacity,
            animation: `rain-fall ${drop.speed}s linear infinite`,
            animationDelay: `${Math.random() * -drop.speed}s`
          }}
          onMouseEnter={() => setHoveredId(drop.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <span
            lang='ja'
            className={clsx(
              'text-[var(--main-color)] transition-all duration-200',
              hoveredId === drop.id && 'text-green-400 scale-150'
            )}
          >
            {drop.kana}
          </span>
          {hoveredId === drop.id && (
            <span className='absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-green-400 whitespace-nowrap font-mono'>
              {drop.romanji}
            </span>
          )}
        </div>
      ))}

      {/* CSS animation */}
      <style jsx>{`
        @keyframes rain-fall {
          0% {
            top: -5%;
          }
          100% {
            top: 105%;
          }
        }
      `}</style>

      {/* Home button */}
      <button
        onClick={handleClose}
        className={clsx(
          'fixed top-4 right-4 z-50 p-2 rounded-lg',
          'bg-[var(--card-color)] border border-[var(--border-color)]',
          'text-[var(--secondary-color)] hover:text-[var(--main-color)]',
          'hover:cursor-pointer transition-all duration-250',
          'active:scale-95'
        )}
        aria-label='Return to home'
      >
        <Home size={24} />
      </button>
    </div>
  );
};

export default KanaRain;
