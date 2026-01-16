
import React from 'react';
import { CartoonTheme, ColorMode } from '../types';

interface ThemeVisualsProps {
  theme: CartoonTheme;
  mode: ColorMode;
}

const THEME_CONTENT: Record<CartoonTheme, { emoji: string; silhouettes: string[] }> = {
  Default: { emoji: '✨', silhouettes: ['🔮', '📜', '⚖️', '🗝️'] },
  Marvel: { emoji: '🛡️', silhouettes: ['🦸‍♂️', '🦾', '🔨', '🕷️'] },
  DC: { emoji: '🦇', silhouettes: ['🦇', '🔱', '⚡', '💪'] },
  Mickey: { emoji: '🐭', silhouettes: ['🐭', '🦆', '🐕', '🧤'] },
  Barbie: { emoji: '💖', silhouettes: ['👠', '🎀', '💄', '👗'] },
  TomJerry: { emoji: '🧀', silhouettes: ['🐱', '🐭', '🔨', '💣'] },
  Anime: { emoji: '🏮', silhouettes: ['⚔️', '🍥', '👺', '👒'] },
};

const ThemeVisuals: React.FC<ThemeVisualsProps> = ({ theme, mode }) => {
  const content = THEME_CONTENT[theme];
  const opacity = mode === 'Dark' ? 'opacity-[0.07]' : 'opacity-[0.03]';

  // Fixed positions for floating elements to avoid "random mess"
  const floatingPositions = [
    { top: '10%', left: '10%' },
    { top: '15%', left: '85%' },
    { top: '80%', left: '15%' },
    { top: '75%', left: '80%' },
    { top: '45%', left: '5%' },
    { top: '50%', left: '90%' },
    { top: '5%', left: '50%' },
    { top: '90%', left: '45%' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Background Silhouettes - Structured Staggered Grid */}
      <div className={`absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-24 p-12 md:p-24 ${opacity} transition-opacity duration-1000`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-center text-8xl md:text-[14rem] grayscale mix-blend-overlay animate-pulse
              ${i % 2 === 0 ? 'translate-y-12' : '-translate-y-12'}
            `}
            style={{ 
              animationDelay: `${i * 0.8}s`, 
              animationDuration: '6s',
              transform: `rotate(${i % 2 === 0 ? '5deg' : '-5deg'})`
            }}
          >
            {content.silhouettes[i % content.silhouettes.length]}
          </div>
        ))}
      </div>

      {/* Floating Icons - Strategic Placement */}
      <div className="absolute inset-0">
        {floatingPositions.map((pos, i) => (
          <div
            key={`float-${i}`}
            className="absolute text-3xl md:text-5xl opacity-20 animate-bounce transition-all duration-1000"
            style={{
              top: pos.top,
              left: pos.left,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }}
          >
            {content.emoji}
          </div>
        ))}
      </div>
      
      {/* Atmospheric Vignette */}
      <div className={`absolute inset-0 pointer-events-none ${mode === 'Dark' ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.4)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)]'}`}></div>
    </div>
  );
};

export default ThemeVisuals;
