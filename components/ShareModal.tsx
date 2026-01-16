
import React from 'react';
import { StorySegment, PersonalityProfile, ColorMode } from '../types';

interface ShareModalProps {
  segment: StorySegment;
  personality: PersonalityProfile;
  title: string;
  onClose: () => void;
  mode: ColorMode;
}

const ShareModal: React.FC<ShareModalProps> = ({ segment, personality, title, onClose, mode }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-[400px] aspect-[9/16] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group">
        {/* Background image if available */}
        {segment.imageUrl && (
          <img 
            src={segment.imageUrl} 
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px] opacity-40 group-hover:scale-100 group-hover:blur-0 transition-all duration-1000"
            alt=""
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col p-10 justify-between text-white">
          <div className="space-y-2">
            <div className="w-12 h-1 bg-amber-500 rounded-full mb-6"></div>
            <h3 className="text-3xl font-serif font-bold leading-tight drop-shadow-lg">{title}</h3>
            <p className="text-xs uppercase tracking-[0.3em] font-black text-amber-500/80">A Chronicle of your Soul</p>
          </div>

          <div className="space-y-6">
            <p className="text-xl font-serif italic leading-relaxed text-slate-100 line-clamp-[8] drop-shadow-md">
              "{segment.text}"
            </p>
            
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Resonance</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{personality.archetypeMatch}</span>
              </div>
              <p className="text-[10px] leading-relaxed opacity-80 font-serif italic">
                "{personality.summary}"
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center pt-4">
             <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/5 text-[10px] font-black uppercase tracking-[0.2em]">
               TellATale AI
             </div>
          </div>
        </div>

        {/* Close & Download Simulation buttons */}
        <div className="absolute top-6 right-6 flex flex-col space-y-3">
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
          >
            ✕
          </button>
          <button 
            onClick={() => alert("Screenshot this beauty for your story! ✨")}
            className="w-10 h-10 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center hover:scale-110 transition-all"
            title="Export as Image"
          >
            📸
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
