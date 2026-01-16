
import React from 'react';
import { CartoonTheme, ColorMode } from '../types';

interface ThemeVisualsProps {
  theme: CartoonTheme;
  mode: ColorMode;
}

const THEME_CONTENT: Record<CartoonTheme, { emoji: string; silhouettes: string[] }> = {
  Default: { emoji: '✨', silhouettes: ['🔮', '📜'] },
  Marvel: { emoji: '🛡️', silhouettes: ['🦸‍♂️', '🦾', '🔨', '🕷️'] },
  DC: { emoji: '🦇', silhouettes: ['🦇', '🔱', '⚡', '💪'] },
  Mickey: { emoji: '🐭', silhouettes: ['🐭', '🦆', '🐕', '🧤'] },
  Barbie: { emoji: '💖', silhouettes: ['👠', '🎀', '💄', '👗'] },
  TomJerry: { emoji: '🧀', silhouettes: ['🐱', '🐭', '🔨', '💣'] },
  Anime: { emoji: '🏮', silhouettes: ['⚔️', '🍥', '👺', '👒'] },
};

const ThemeVisuals: React.FC<ThemeVisualsProps> = ({ theme, mode }) => {
  const content = THEME_CONTENT[theme];
  const opacity = mode === 'Dark' ? 'opacity-10' : 'opacity-5';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Background Watermarks (Silhouettes) */}
      <div className={`absolute inset-0 grid grid-cols-4 grid-rows-4 gap-20 p-20 ${opacity} transition-opacity duration-1000`}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div 
            key={i} 
            className="flex items-center justify-center text-8xl md:text-[12rem] grayscale mix-blend-overlay animate-pulse"
            style={{ animationDelay: `${i * 0.5}s`, animationDuration: '4s' }}
          >
            {content.silhouettes[i % content.silhouettes.length]}
          </div>
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`float-${i}`}
            className="absolute text-4xl opacity-20 animate-bounce"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {content.emoji}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeVisuals;
