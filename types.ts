
export interface StorySegment {
  id: string;
  text: string;
  visualPrompt: string;
  choices: StoryChoice[];
  imageUrl?: string;
  audioData?: string;
  soulInsight?: string;
}

export interface StoryChoice {
  text: string;
  consequence: string;
}

export interface SoulTraits {
  valiance: number;
  empathy: number;
  shadow: number;
  logic: number;
  chaos: number;
}

export interface PersonalityProfile {
  traits: SoulTraits;
  summary: string;
  archetypeMatch: string;
}

export interface SavedStory {
  id: string;
  title: string;
  genre: string;
  timestamp: number;
  segments: StorySegment[];
  personality: PersonalityProfile;
}

export interface User {
  username: string;
  password?: string; // Stored in plain text for this simple simulation as requested
  history: SavedStory[];
}

export interface StoryState {
  title: string;
  genre: string;
  segments: StorySegment[];
  isGenerating: boolean;
  isNarrating: boolean;
  personality: PersonalityProfile;
}

export type Genre = 'Fantasy' | 'Sci-Fi' | 'Mystery' | 'Horror' | 'Fairy Tale' | 'Steampunk' | 'Cyberpunk' | 'Noir';
export type Archetype = 'Hero' | 'Trickster' | 'Mentor' | 'Outcast' | 'Seeker';
export type CartoonTheme = 'Default' | 'Marvel' | 'DC' | 'Mickey' | 'Barbie' | 'TomJerry' | 'Anime';
export type ColorMode = 'Dark' | 'Light';

export interface StoryConfig {
  genre: Genre;
  archetype: Archetype;
  protagonistName: string;
  setting: string;
  tone: string;
}
