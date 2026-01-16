
import React, { useState } from 'react';
import { PersonalityProfile, ColorMode } from '../types';

interface SoulMirrorProps {
  profile: PersonalityProfile;
  mode: ColorMode;
}

const SoulMirror: React.FC<SoulMirrorProps> = ({ profile, mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { valiance, empathy, shadow, logic, chaos } = profile.traits;

  // Calculate SVG points for a radar-like shape
  const size = 200;
  const center = size / 2;
  const r = (val: number) => (val / 100) * (size / 2.5);

  const points = [
    [center, center - r(valiance)], // Top
    [center + r(empathy), center - r(empathy) * 0.3], // Top Right
    [center + r(logic) * 0.8, center + r(logic) * 0.8], // Bottom Right
    [center - r(chaos) * 0.8, center + r(chaos) * 0.8], // Bottom Left
    [center - r(shadow), center - r(shadow) * 0.3], // Top Left
  ].map(p => p.join(',')).join(' ');

  const glowColor = `rgba(${valiance * 2.5}, ${empathy * 2.5}, ${chaos * 2.5}, 0.5)`;

  return (
    <div className="fixed bottom-24 right-8 z-[100]">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative cursor-pointer group transition-all duration-500 ${isOpen ? 'scale-110' : 'hover:scale-105'}`}
      >
        {/* The Pulsing Core */}
        <div 
          className="w-16 h-16 rounded-full blur-xl animate-pulse absolute inset-0 opacity-70"
          style={{ backgroundColor: glowColor }}
        ></div>
        
        <div className={`w-16 h-16 rounded-full border-2 border-white/20 backdrop-blur-xl flex items-center justify-center relative overflow-hidden bg-slate-900/40`}>
          <svg width="40" height="40" viewBox="0 0 100 100" className="drop-shadow-lg">
            <polygon 
              points={points} 
              fill="url(#soulGradient)" 
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="soulGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Tooltip hint */}
        {!isOpen && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900/80 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase text-amber-500 border border-amber-500/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Soul Mirror
          </div>
        )}
      </div>

      {/* Expanded Analysis Card */}
      {isOpen && (
        <div className={`absolute bottom-20 right-0 w-80 p-6 rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 ${mode === 'Dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-serif font-bold">The Soul's Reflection</h4>
            <button onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100">✕</button>
          </div>
          
          <div className="space-y-4 mb-6">
            <TraitBar label="Valiance" val={valiance} color="bg-amber-500" />
            <TraitBar label="Empathy" val={empathy} color="bg-emerald-500" />
            <TraitBar label="Shadow" val={shadow} color="bg-purple-600" />
            <TraitBar label="Logic" val={logic} color="bg-blue-500" />
            <TraitBar label="Chaos" val={chaos} color="bg-rose-500" />
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <p className="text-xs font-serif italic opacity-80 leading-relaxed">
              "{profile.summary}"
            </p>
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Resonance:</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{profile.archetypeMatch}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TraitBar = ({ label, val, color }: { label: string; val: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider opacity-60">
      <span>{label}</span>
      <span>{val}%</span>
    </div>
    <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000`} 
        style={{ width: `${val}%` }}
      ></div>
    </div>
  </div>
);

export default SoulMirror;
