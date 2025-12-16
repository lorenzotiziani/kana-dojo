'use client';
import { useEffect, useState, useCallback } from 'react';
import { Home, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useClick, useCorrect } from '@/shared/hooks/useAudio';
import { hiraganaOnly } from '../data/kanaData';

interface GardenTile {
  kana: string;
  romanji: string;
  isActive: boolean;
}

const SoundGarden = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [tiles, setTiles] = useState<GardenTile[]>([]);
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);
  const { playClick } = useClick();
  const { playCorrect } = useCorrect();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    // Use first 20 hiragana for the garden
    const gardenKana = hiraganaOnly.slice(0, 20).map(k => ({
      kana: k.kana,
      romanji: k.romanji,
      isActive: false
    }));
    setTiles(gardenKana);
  }, []);

  const handleTileClick = useCallback(
    (index: number) => {
      playCorrect();
      setLastPlayed(tiles[index]?.romanji || null);

      setTiles(prev =>
        prev.map((tile, i) => ({
          ...tile,
          isActive: i === index
        }))
      );

      // Reset active state after animation
      setTimeout(() => {
        setTiles(prev =>
          prev.map(tile => ({
            ...tile,
            isActive: false
          }))
        );
      }, 300);
    },
    [tiles, playCorrect]
  );

  const handleClose = () => {
    playClick();
    router.push('/');
  };

  if (!isMounted) return null;

  return (
    <div className='relative min-h-[100dvh] max-w-[100dvw] overflow-hidden bg-[var(--background-color)] flex items-center justify-center p-4'>
      <div className='flex flex-col items-center gap-8 max-w-2xl w-full'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-2xl md:text-3xl text-[var(--main-color)] flex items-center gap-2 justify-center'>
            <Volume2 size={28} />
            Sound Garden
          </h1>
          <p className='text-[var(--secondary-color)] mt-2'>
            Tap the kana to hear their sounds
          </p>
        </div>

        {/* Last played indicator */}
        {lastPlayed && (
          <div className='text-lg text-[var(--secondary-color)]'>
            Last: <span className='text-[var(--main-color)]'>{lastPlayed}</span>
          </div>
        )}

        {/* Kana grid */}
        <div className='grid grid-cols-5 gap-3 md:gap-4'>
          {tiles.map((tile, index) => (
            <button
              key={tile.kana}
              onClick={() => handleTileClick(index)}
              className={clsx(
                'w-14 h-14 md:w-16 md:h-16 rounded-xl',
                'bg-[var(--card-color)] border-2 border-[var(--border-color)]',
                'flex flex-col items-center justify-center',
                'hover:cursor-pointer transition-all duration-150',
                'hover:border-[var(--main-color)] hover:scale-105',
                'active:scale-95',
                tile.isActive &&
                  'bg-[var(--main-color)] scale-110 border-[var(--main-color)]'
              )}
            >
              <span
                lang='ja'
                className={clsx(
                  'text-2xl md:text-3xl transition-colors',
                  tile.isActive
                    ? 'text-[var(--background-color)]'
                    : 'text-[var(--main-color)]'
                )}
              >
                {tile.kana}
              </span>
              <span
                className={clsx(
                  'text-xs transition-colors',
                  tile.isActive
                    ? 'text-[var(--background-color)]'
                    : 'text-[var(--secondary-color)]'
                )}
              >
                {tile.romanji}
              </span>
            </button>
          ))}
        </div>

        {/* Instructions */}
        <p className='text-sm text-[var(--secondary-color)] text-center'>
          Create melodies by tapping different kana in sequence
        </p>
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

export default SoundGarden;
