
import React from 'react';
import { User, SavedStory, ColorMode } from '../types';

interface HistoryViewProps {
  user: User;
  onSelectStory: (story: SavedStory) => void;
  mode: ColorMode;
  onClose: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ user, onSelectStory, mode, onClose }) => {
  const bgColor = mode === 'Dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200';
  const textColor = mode === 'Dark' ? 'text-slate-100' : 'text-slate-900';

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-300">
      <div className={`w-full max-w-md h-full shadow-2xl p-8 border-l flex flex-col animate-in slide-in-from-right duration-500 ${bgColor} ${textColor}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold">Chronicles</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-500/10 rounded-full transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {user.history.length === 0 ? (
            <div className="text-center py-20 opacity-40">
              <p className="text-4xl mb-4">📖</p>
              <p className="text-sm font-black uppercase tracking-widest">No legends written yet</p>
            </div>
          ) : (
            user.history.map(story => (
              <div 
                key={story.id}
                onClick={() => onSelectStory(story)}
                className={`group p-6 rounded-[2rem] border transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${mode === 'Dark' ? 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50' : 'bg-slate-50 border-slate-100 hover:border-amber-500/50'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 opacity-60 group-hover:opacity-100">{story.genre}</span>
                  <span className="text-[10px] opacity-40">{new Date(story.timestamp).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-amber-500 transition-colors">{story.title}</h3>
                <p className="text-xs opacity-50 line-clamp-2 italic mb-4">"{story.segments[0].text}"</p>
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                   <span>Chapters: {story.segments.length}</span>
                   <span>•</span>
                   <span>Soul: {story.personality.archetypeMatch}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
