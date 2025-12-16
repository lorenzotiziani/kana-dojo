'use client';
import { useEffect, useState, useCallback } from 'react';
import { Home, Play, Pause } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useClick } from '@/shared/hooks/useAudio';
import { getRandomKana } from '../data/kanaData';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASE_DURATIONS = {
  inhale: 4000,
  hold: 4000,
  exhale: 4000,
  rest: 2000
};

const PHASE_LABELS = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
  rest: 'Rest'
};

const BreathingExercise = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [currentKana, setCurrentKana] = useState(getRandomKana());
  const [cycleCount, setCycleCount] = useState(0);
  const { playClick } = useClick();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      switch (phase) {
        case 'inhale':
          setPhase('hold');
          break;
        case 'hold':
          setPhase('exhale');
          break;
        case 'exhale':
          setPhase('rest');
          break;
        case 'rest':
          setPhase('inhale');
          setCurrentKana(getRandomKana());
          setCycleCount(c => c + 1);
          break;
      }
    }, PHASE_DURATIONS[phase]);

    return () => clearTimeout(timer);
  }, [phase, isPlaying]);

  const handleClose = () => {
    playClick();
    router.push('/');
  };

  const togglePlay = () => {
    playClick();
    setIsPlaying(!isPlaying);
  };

  if (!isMounted) return null;

  const scale =
    phase === 'inhale' || phase === 'hold' ? 'scale-100' : 'scale-75';
  const duration = `duration-[${PHASE_DURATIONS[phase]}ms]`;

  return (
    <div className='relative min-h-[100dvh] max-w-[100dvw] overflow-hidden bg-[var(--background-color)] flex items-center justify-center'>
      {/* Breathing circle */}
      <div className='relative flex flex-col items-center gap-8'>
        <div
          className={clsx(
            'w-64 h-64 md:w-80 md:h-80 rounded-full',
            'bg-[var(--card-color)] border-4 border-[var(--border-color)]',
            'flex items-center justify-center',
            'transition-transform ease-in-out',
            scale,
            phase === 'inhale' && 'duration-[4000ms]',
            phase === 'hold' && 'duration-[4000ms]',
            phase === 'exhale' && 'duration-[4000ms]',
            phase === 'rest' && 'duration-[2000ms]'
          )}
        >
          <div className='text-center'>
            <span
              lang='ja'
              className='text-6xl md:text-8xl text-[var(--main-color)] block'
            >
              {currentKana.kana}
            </span>
            <span className='text-xl md:text-2xl text-[var(--secondary-color)]'>
              {currentKana.romanji}
            </span>
          </div>
        </div>

        {/* Phase indicator */}
        <div className='text-center'>
          <p className='text-2xl md:text-3xl text-[var(--main-color)] font-medium'>
            {PHASE_LABELS[phase]}
          </p>
          <p className='text-sm text-[var(--secondary-color)] mt-2'>
            Cycle {cycleCount + 1}
          </p>
        </div>

        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className={clsx(
            'p-4 rounded-full',
            'bg-[var(--card-color)] border border-[var(--border-color)]',
            'text-[var(--secondary-color)] hover:text-[var(--main-color)]',
            'hover:cursor-pointer transition-all duration-250',
            'active:scale-95'
          )}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>

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

export default BreathingExercise;
