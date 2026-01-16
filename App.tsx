
import React, { useState, useRef, useEffect } from 'react';
import { StoryConfig, StoryState, StoryChoice, StorySegment, CartoonTheme, ColorMode, PersonalityProfile, User, SavedStory } from './types';
import { generateInitialSegment, generateNextSegment, generateIllustration, generateNarration } from './services/geminiService';
import { analyzeSoulShift } from './services/personalityService';
import { saveStoryToHistory } from './services/storageService';
import StoryConfigForm from './components/StoryConfigForm';
import StoryView from './components/StoryView';
import ThemeVisuals from './components/ThemeVisuals';
import SoulMirror from './components/SoulMirror';
import AuthForm from './components/AuthForm';
import HistoryView from './components/HistoryView';
import ShareModal from './components/ShareModal';

const INITIAL_PERSONALITY: PersonalityProfile = {
  traits: { valiance: 50, empathy: 50, shadow: 10, logic: 50, chaos: 20 },
  summary: "A soul yet to be tested, standing at the precipice of destiny.",
  archetypeMatch: "The Unwritten"
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [shareData, setShareData] = useState<{ segment: StorySegment; personality: PersonalityProfile } | null>(null);
  const [theme, setTheme] = useState<CartoonTheme>('Default');
  const [colorMode, setColorMode] = useState<ColorMode>('Dark');
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);
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
      setTimeout(() => {
        scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [state.segments]);

  // Sync state with local storage
  useEffect(() => {
    if (user && state.segments.length > 0 && currentStoryId) {
      const savedStory: SavedStory = {
        id: currentStoryId,
        title: state.title,
        genre: state.genre,
        timestamp: Date.now(),
        segments: state.segments,
        personality: state.personality
      };
      const updatedUser = saveStoryToHistory(user.username, savedStory);
      if (updatedUser) setUser(updatedUser);
    }
  }, [state.segments, state.personality, state.title, currentStoryId, user]);

  const handleStartStory = async (storyConfig: StoryConfig) => {
    setConfig(storyConfig);
    setState(prev => ({ ...prev, isGenerating: true, segments: [] }));
    const newId = crypto.randomUUID();
    setCurrentStoryId(newId);
    
    try {
      const { title, segment } = await generateInitialSegment(storyConfig);
      const imageUrl = await generateIllustration(segment.visualPrompt);
      const audioData = await generateNarration(segment.text);

      setState(prev => ({
        ...prev,
        title,
        genre: storyConfig.genre,
        segments: [{ ...segment, imageUrl, audioData }],
        isGenerating: false,
      }));
    } catch (error) {
      console.error("Story initiation failed", error);
      alert("Failed to weave the tale. Please check your connection and try again.");
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleChoiceSelection = async (choice: StoryChoice) => {
    if (!config || state.isGenerating) return;
    
    setState(prev => ({ ...prev, isGenerating: true }));

    try {
      const historyStr = state.segments.map(s => s.text).join(" ");
      
      // Parallelize AI calls for speed and better UX
      const [newPersonality, nextSegment] = await Promise.all([
        analyzeSoulShift(state.personality, choice, historyStr),
        generateNextSegment(state.segments, choice, config)
      ]);

      const [imageUrl, audioData] = await Promise.all([
        generateIllustration(nextSegment.visualPrompt),
        generateNarration(nextSegment.text)
      ]);

      setState(prev => ({
        ...prev,
        personality: newPersonality,
        segments: [...prev.segments, { ...nextSegment, imageUrl, audioData }],
        isGenerating: false
      }));
    } catch (error) {
      console.error("Next segment generation failed", error);
      alert("The thread of destiny snapped. Retrying might restore it.");
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleSelectHistory = (story: SavedStory) => {
    setCurrentStoryId(story.id);
    setState({
      title: story.title,
      genre: story.genre,
      segments: story.segments,
      isGenerating: false,
      isNarrating: false,
      personality: story.personality
    });
    // Restore config from history
    setConfig({
       genre: story.genre as any,
       archetype: 'Hero',
       protagonistName: 'Chronicle Traveler',
       setting: 'The Past',
       tone: 'Nostalgic'
    });
    setShowHistory(false);
  };

  const resetStory = () => {
    if (state.segments.length > 0 && !window.confirm("Abandon this legend to start a new one?")) return;
    setConfig(null);
    setCurrentStoryId(null);
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
    Default: 'amber', Marvel: 'red', DC: 'blue', Mickey: 'yellow', Barbie: 'pink', TomJerry: 'orange', Anime: 'indigo'
  }[theme];

  const bgColor = colorMode === 'Dark' ? 'bg-slate-950' : 'bg-slate-50';
  const textColor = colorMode === 'Dark' ? 'text-slate-100' : 'text-slate-900';
  const headerBg = colorMode === 'Dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200';

  return (
    <div className={`min-h-screen transition-colors duration-700 ${bgColor} ${textColor} selection:bg-${themeColors}-500/30 overflow-x-hidden`}>
      <ThemeVisuals theme={theme} mode={colorMode} />
      
      {user && (
        <div className="fixed top-24 right-4 md:right-8 z-[100] flex flex-col space-y-4">
           <button 
             onClick={() => setShowHistory(true)}
             className={`w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center backdrop-blur-xl shadow-xl hover:scale-110 transition-all ${colorMode === 'Dark' ? 'bg-slate-900/60 border-white/10' : 'bg-white/60 border-slate-900/10'}`}
             title="Open Chronicles"
           >
             📖
           </button>
           {config && <SoulMirror profile={state.personality} mode={colorMode} />}
        </div>
      )}

      {shareData && (
        <ShareModal 
          title={state.title}
          segment={shareData.segment}
          personality={shareData.personality}
          mode={colorMode}
          onClose={() => setShareData(null)}
        />
      )}

      {showHistory && user && (
        <HistoryView 
          user={user}
          mode={colorMode}
          onSelectStory={handleSelectHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      <header className={`sticky top-0 z-50 backdrop-blur-lg border-b h-20 transition-all ${headerBg}`}>
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={resetStory}>
            <div className={`w-10 h-10 bg-${themeColors}-500 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12`}>
              <span className="text-slate-900 font-black text-xl">T</span>
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight hidden sm:block">TellATale</span>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-6">
            {user && (
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 hidden lg:block">
                Chronicle: {user.username}
              </span>
            )}
            
            <button 
              onClick={() => setColorMode(prev => prev === 'Dark' ? 'Light' : 'Dark')}
              className={`p-2.5 rounded-full border transition-all ${colorMode === 'Dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
            >
              {colorMode === 'Dark' ? '🌙' : '☀️'}
            </button>

            <div className="relative group">
              <button className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center space-x-2 transition-all ${colorMode === 'Dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}>
                <span>{theme}</span>
                <span className="text-[10px] opacity-40 group-hover:rotate-180 transition-transform">▼</span>
              </button>
              <div className={`absolute top-full right-0 mt-2 w-48 py-2 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100] border ${colorMode === 'Dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                {['Default', 'Marvel', 'DC', 'Mickey', 'Barbie', 'TomJerry', 'Anime'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t as CartoonTheme)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-500/10 transition-colors ${theme === t ? `text-${themeColors}-500 font-black` : ''}`}
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
        {!user ? (
          <div className="py-20 animate-in fade-in zoom-in duration-500">
            <AuthForm mode={colorMode} onAuthSuccess={setUser} />
          </div>
        ) : !config ? (
          <div className="py-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="text-center mb-16 space-y-6">
              <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tighter">
                Craft Your <span className={`text-${themeColors}-500 drop-shadow-sm`}>Legend</span>
              </h1>
              <p className="text-lg md:text-2xl opacity-60 max-w-2xl mx-auto font-light px-4">
                Step into a world woven from your soul. Every choice transforms the canvas of destiny.
              </p>
            </div>
            <StoryConfigForm onSubmit={handleStartStory} />
          </div>
        ) : (
          <div className="pb-40 w-full max-w-5xl mx-auto">
            {state.segments.length === 0 && state.isGenerating && (
              <div className="flex flex-col items-center justify-center py-40 space-y-12 animate-in fade-in duration-1000">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <div className={`absolute inset-0 border-4 border-${themeColors}-500/20 rounded-full animate-pulse`}></div>
                  <div className={`absolute inset-0 border-4 border-${themeColors}-500 border-t-transparent rounded-full animate-spin`}></div>
                </div>
                <div className="text-center space-y-4">
                  <h3 className={`text-2xl md:text-4xl font-serif font-bold text-${themeColors}-500`}>Summoning the First Thread...</h3>
                  <p className="opacity-50 text-base md:text-xl">Your story is taking shape in the void.</p>
                </div>
              </div>
            )}
            
            <div className="space-y-12 md:space-y-24">
              {state.segments.map((segment, idx) => (
                <StoryView 
                  key={segment.id} 
                  segment={segment} 
                  onChoice={handleChoiceSelection}
                  onShare={() => setShareData({ segment, personality: state.personality })}
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
