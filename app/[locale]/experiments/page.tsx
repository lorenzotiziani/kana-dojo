'use client';
import { Link } from '@/core/i18n/routing';
import {
  Home,
  Wind,
  CloudRain,
  Sparkles,
  Volume2,
  BookOpen,
  Star,
  Keyboard,
  Brain,
  Leaf
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useClick } from '@/shared/hooks/useAudio';

const experiments = [
  {
    name: 'Zen Mode',
    description: 'Relax with animated decorations',
    href: '/zen',
    icon: Leaf,
    color: 'text-green-400'
  },
  {
    name: 'Breathing',
    description: 'Guided breathing with kana',
    href: '/experiments/breathing',
    icon: Wind,
    color: 'text-blue-400'
  },
  {
    name: 'Ambient',
    description: 'Floating kana atmosphere',
    href: '/experiments/ambient',
    icon: Sparkles,
    color: 'text-purple-400'
  },
  {
    name: 'Kana Rain',
    description: 'Matrix-style falling characters',
    href: '/experiments/rain',
    icon: CloudRain,
    color: 'text-cyan-400'
  },
  {
    name: 'Sound Garden',
    description: 'Interactive kana sounds',
    href: '/experiments/sound',
    icon: Volume2,
    color: 'text-yellow-400'
  },
  {
    name: 'Daily Haiku',
    description: 'A new haiku every day',
    href: '/experiments/haiku',
    icon: BookOpen,
    color: 'text-pink-400'
  },
  {
    name: 'Constellation',
    description: 'Connect kana stars',
    href: '/experiments/constellation',
    icon: Star,
    color: 'text-amber-400'
  },
  {
    name: 'Speed Typing',
    description: 'Test your romanji speed',
    href: '/experiments/typing',
    icon: Keyboard,
    color: 'text-red-400'
  },
  {
    name: 'Memory Palace',
    description: 'Spatial memory game',
    href: '/experiments/memory',
    icon: Brain,
    color: 'text-indigo-400'
  }
];

export default function ExperimentsPage() {
  const { playClick } = useClick();
  const router = useRouter();

  return (
    <div className='min-h-[100dvh] bg-[var(--background-color)] p-4 md:p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl md:text-3xl text-[var(--main-color)]'>
              Experiments
            </h1>
            <p className='text-[var(--secondary-color)] mt-1'>
              Relaxation and experimental features
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              router.push('/');
            }}
            className={clsx(
              'p-2 rounded-lg',
              'bg-[var(--card-color)] border border-[var(--border-color)]',
              'text-[var(--secondary-color)] hover:text-[var(--main-color)]',
              'hover:cursor-pointer transition-all duration-250',
              'active:scale-95'
            )}
          >
            <Home size={24} />
          </button>
        </div>

        {/* Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {experiments.map(exp => (
            <Link
              key={exp.name}
              href={exp.href}
              onClick={() => playClick()}
              className={clsx(
                'p-6 rounded-xl',
                'bg-[var(--card-color)] border border-[var(--border-color)]',
                'hover:border-[var(--main-color)] hover:scale-[1.02]',
                'transition-all duration-250',
                'flex flex-col gap-3'
              )}
            >
              <exp.icon size={32} className={exp.color} />
              <div>
                <h2 className='text-lg text-[var(--main-color)]'>{exp.name}</h2>
                <p className='text-sm text-[var(--secondary-color)]'>
                  {exp.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
