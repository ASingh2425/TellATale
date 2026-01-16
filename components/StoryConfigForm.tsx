
import React, { useState } from 'react';
import { StoryConfig, Genre, Archetype } from '../types';

interface StoryConfigFormProps {
  onSubmit: (config: StoryConfig) => void;
}

const GENRES: Genre[] = ['Fantasy', 'Sci-Fi', 'Mystery', 'Horror', 'Fairy Tale', 'Steampunk', 'Cyberpunk', 'Noir'];
const ARCHETYPES: { id: Archetype; label: string; desc: string }[] = [
  { id: 'Hero', label: 'The Hero', desc: 'Brave, determined, and destined for greatness.' },
  { id: 'Trickster', label: 'The Trickster', desc: 'Witty, mischievous, and breaks the rules.' },
  { id: 'Mentor', label: 'The Mentor', desc: 'Wise, experienced, and guides others.' },
  { id: 'Outcast', label: 'The Outcast', desc: 'Misunderstood, lonely, and walks a solitary path.' },
  { id: 'Seeker', label: 'The Seeker', desc: 'Curious, wandering, and searching for truth.' },
];

const StoryConfigForm: React.FC<StoryConfigFormProps> = ({ onSubmit }) => {
  const [config, setConfig] = useState<StoryConfig>({
    genre: 'Fantasy',
    archetype: 'Hero',
    protagonistName: '',
    setting: '',
    tone: 'Epic & Mysterious'
  });

  const isFormValid = config.protagonistName.trim() !== '' && config.setting.trim() !== '';

  return (
    <div className="max-w-2xl mx-auto p-8 bg-slate-900/80 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-xl">
      <h2 className="text-3xl font-serif font-bold text-center mb-8 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
        Begin Your Narrative
      </h2>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">The Genre</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GENRES.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setConfig({ ...config, genre: g })}
                className={`px-3 py-2 rounded-lg text-xs transition-all border ${
                  config.genre === g 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">Character Archetype</label>
          <div className="grid grid-cols-1 gap-3">
            {ARCHETYPES.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => setConfig({ ...config, archetype: a.id })}
                className={`flex flex-col items-start p-4 rounded-xl text-left transition-all border ${
                  config.archetype === a.id 
                  ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
              >
                <span className={`text-sm font-bold ${config.archetype === a.id ? 'text-amber-400' : 'text-slate-200'}`}>
                  {a.label}
                </span>
                <span className="text-xs text-slate-500 mt-1">{a.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Hero's Name</label>
            <input
              type="text"
              placeholder="e.g. Elara, Jax"
              value={config.protagonistName}
              onChange={(e) => setConfig({ ...config, protagonistName: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Narrative Tone</label>
            <input
              type="text"
              placeholder="e.g. Gritty, Whimsical"
              value={config.tone}
              onChange={(e) => setConfig({ ...config, tone: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">The Setting</label>
          <input
            type="text"
            placeholder="e.g. A floating city above the clouds"
            value={config.setting}
            onChange={(e) => setConfig({ ...config, setting: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <button
          onClick={() => isFormValid && onSubmit(config)}
          disabled={!isFormValid}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed mt-4"
        >
          Weave the Tale
        </button>
      </div>
    </div>
  );
};

export default StoryConfigForm;
