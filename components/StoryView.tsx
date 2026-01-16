
import React, { useEffect, useRef } from 'react';
import { StorySegment, StoryChoice } from '../types';
import { decodeBase64, decodeAudioData } from '../utils/audio';

interface StoryViewProps {
  segment: StorySegment;
  onChoice: (choice: StoryChoice) => void;
  isGenerating: boolean;
  isLast: boolean;
}

const StoryView: React.FC<StoryViewProps> = ({ segment, onChoice, isGenerating, isLast }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (segment.audioData && isLast) {
      playNarration(segment.audioData);
    }
    return () => {
      stopNarration();
    };
  }, [segment.audioData, isLast]);

  const playNarration = async (base64Data: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      const bytes = decodeBase64(base64Data);
      const audioBuffer = await decodeAudioData(bytes, ctx);
      
      stopNarration();
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
      currentSourceRef.current = source;
    } catch (error) {
      console.error("Narration failed", error);
    }
  };

  const stopNarration = () => {
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      currentSourceRef.current = null;
    }
  };

  return (
    <div className={`transition-all duration-1000 ease-out ${isLast ? 'opacity-100 scale-100 translate-y-0' : 'opacity-40 scale-95 blur-sm translate-y-10 pointer-events-none'}`}>
      <div className="w-full bg-slate-900/40 dark:bg-slate-900/60 rounded-[3rem] overflow-hidden border border-slate-700/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-3xl group">
        {segment.imageUrl && (
          <div className="w-full aspect-[21/9] relative overflow-hidden">
            <img 
              src={segment.imageUrl} 
              alt="Story illustration" 
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            <div className="absolute bottom-6 left-12">
               <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white animate-[progress_10s_linear_infinite]"></div>
               </div>
            </div>
          </div>
        )}

        <div className="p-8 md:p-16">
          <p className="text-2xl md:text-3xl font-serif leading-relaxed mb-12 whitespace-pre-wrap tracking-tight">
            {segment.text}
          </p>

          {isLast && !isGenerating && segment.choices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {segment.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => onChoice(choice)}
                  className="group relative p-8 bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700/50 rounded-[2rem] transition-all duration-500 text-left hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  <span className="block text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-3 opacity-60 group-hover:opacity-100">
                    Pathway {idx + 1}
                  </span>
                  <span className="text-lg md:text-xl font-bold leading-tight">
                    {choice.text}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Hover arrow icon */}
                  <div className="absolute bottom-6 right-8 text-2xl translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                    →
                  </div>
                </button>
              ))}
            </div>
          )}

          {isLast && isGenerating && (
            <div className="flex items-center space-x-6 mt-12 py-6 border-t border-slate-800/50">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce delay-300"></div>
              </div>
              <span className="text-sm font-black tracking-[0.3em] uppercase opacity-40">The tale continues...</span>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default StoryView;
