
import React, { useState, useRef, useEffect } from 'react';
import { StoryConfig, StoryState, StoryChoice, StorySegment, CartoonTheme, ColorMode, PersonalityProfile } from './types';
import { generateInitialSegment, generateNextSegment, generateIllustration, generateNarration } from './services/geminiService';
import { analyzeSoulShift } from './services/personalityService';
import StoryConfigForm from './components/StoryConfigForm';
import StoryView from './components/StoryView';
import ThemeVisuals from './components/ThemeVisuals';
import SoulMirror from './components/SoulMirror';

const INITIAL_PERSONALITY: PersonalityProfile = {
  traits: { valiance: 50, empathy: 50, shadow: 10, logic: 50, chaos: 20 },
  summary: "A soul yet to be tested, standing at the precipice of destiny.",
  archetypeMatch: "The Unwritten"
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<CartoonTheme>('Default');
  const [colorMode, setColorMode] = useState<ColorMode>('Dark');
  const [state, setState] = useState<StoryState>({
    title: '',
    genre: '',
    segments: [],
    isGenerating: false,
    isNarrating: false,
    personality: INITIAL_PERSONALITY
  });
  
  const [config, setConfig] = useState<StoryConfig | null>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.segments.length > 0) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.segments]);

  const handleStartStory = async (storyConfig: StoryConfig) => {
    setConfig(storyConfig);
    setState(prev => ({ ...prev, isGenerating: true }));
    
    try {
      const { title, segment } = await generateInitialSegment(storyConfig);
      const [imageUrl, audioData] = await Promise.all([
        generateIllustration(segment.visualPrompt),
        generateNarration(segment.text)
      ]);

      setState(prev => ({
        ...prev,
        title,
        genre: storyConfig.genre,
        segments: [{ ...segment, imageUrl, audioData }],
        isGenerating: false,
      }));
    } catch (error) {
      console.error("Story initiation failed", error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleChoiceSelection = async (choice: StoryChoice) => {
    if (!config || state.isGenerating) return;
    setState(prev => ({ ...prev, isGenerating: true }));

    try {
      // Analyze personality shift in parallel with story generation
      const historyStr = state.segments.map(s => s.text).join(" ");
      const personalityPromise = analyzeSoulShift(state.personality, choice, historyStr);
      
      const nextSegmentPromise = generateNextSegment(state.segments, choice, config);
      
      const [newPersonality, nextSegment] = await Promise.all([
        personalityPromise,
        nextSegmentPromise
      ]);

      const illustrationPromise = generateIllustration(nextSegment.visualPrompt);
      const narrationPromise = generateNarration(nextSegment.text);
      
      const [imageUrl, audioData] = await Promise.all([
        illustrationPromise,
        narrationPromise
      ]);

      setState(prev => ({
        ...prev,
        personality: newPersonality,
        segments: [...prev.segments, { ...nextSegment, imageUrl, audioData }],
        isGenerating: false
      }));
    } catch (error) {
      console.error("Next segment generation failed", error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const resetStory = () => {
    setConfig(null);
    setState({
      title: '',
      genre: '',
      segments: [],
      isGenerating: false,
      isNarrating: false,
      personality: INITIAL_PERSONALITY
    });
  };

  const themeColors = {
    Default: 'amber',
    Marvel: 'red',
    DC: 'blue',
    Mickey: 'yellow',
    Barbie: 'pink',
    TomJerry: 'orange',
    Anime: 'indigo'
  }[theme];

  const bgColor = colorMode === 'Dark' ? 'bg-slate-950' : 'bg-slate-50';
  const textColor = colorMode === 'Dark' ? 'text-slate-100' : 'text-slate-900';
  const headerBg = colorMode === 'Dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${bgColor} ${textColor} selection:bg-${themeColors}-500/30 overflow-x-hidden`}>
      <ThemeVisuals theme={theme} mode={colorMode} />
      
      {/* Unique Market Element: Soul Mirror */}
      {config && <SoulMirror profile={state.personality} mode={colorMode} />}

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-lg border-b ${headerBg}`}>
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={resetStory}>
            <div className={`w-10 h-10 bg-${themeColors}-500 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
              <span className="text-slate-900 font-black text-xl">T</span>
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight hidden sm:block">TellATale</span>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-6">
            <button 
              onClick={() => setColorMode(prev => prev === 'Dark' ? 'Light' : 'Dark')}
              className={`p-2 rounded-full border transition-all ${colorMode === 'Dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
              title="Toggle Light/Dark Mode"
            >
              {colorMode === 'Dark' ? '🌙' : '☀️'}
            </button>

            <div className="relative group">
              <button className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center space-x-2 transition-all ${colorMode === 'Dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}>
                <span>{theme}</span>
                <span className="text-[10px] opacity-50">▼</span>
              </button>
              <div className={`absolute top-full right-0 mt-2 w-48 py-2 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100] border ${colorMode === 'Dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                {['Default', 'Marvel', 'DC', 'Mickey', 'Barbie', 'TomJerry', 'Anime'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t as CartoonTheme)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-500/10 transition-colors ${theme === t ? `text-${themeColors}-500 font-bold` : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {!config ? (
          <div className="py-20">
            <div className="text-center mb-16 space-y-6">
              <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter">
                Craft Your <span className={`text-${themeColors}-500 drop-shadow-sm`}>Legend</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-60 max-w-2xl mx-auto font-light">
                Every choice ripples through your soul. Discover who you truly are through the stories you tell.
              </p>
            </div>
            <StoryConfigForm onSubmit={handleStartStory} />
          </div>
        ) : (
          <div className="pb-40">
            {state.segments.length === 0 && state.isGenerating && (
              <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-in fade-in zoom-in duration-1000">
                <div className="relative w-32 h-32">
                  <div className={`absolute inset-0 border-4 border-${themeColors}-500/20 rounded-full animate-pulse`}></div>
                  <div className={`absolute inset-0 border-4 border-${themeColors}-500 border-t-transparent rounded-full animate-spin`}></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className={`text-3xl font-serif font-bold text-${themeColors}-500`}>Whispering to the Void...</h3>
                  <p className="opacity-50 text-lg">Drawing the first thread of your destiny.</p>
                </div>
              </div>
            )}
            
            <div className="space-y-20 max-w-5xl mx-auto">
              {state.segments.map((segment, idx) => (
                <StoryView 
                  key={segment.id} 
                  segment={segment} 
                  onChoice={handleChoiceSelection}
                  isGenerating={state.isGenerating}
                  isLast={idx === state.segments.length - 1}
                />
              ))}
            </div>
            <div ref={scrollEndRef} className="h-20" />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
