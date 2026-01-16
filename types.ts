
export interface StorySegment {
  id: string;
  text: string;
  visualPrompt: string;
  choices: StoryChoice[];
  imageUrl?: string;
  audioData?: string;
  soulInsight?: string; // AI's brief psychological comment on the choice
}

export interface StoryChoice {
  text: string;
  consequence: string;
}

export interface SoulTraits {
  valiance: number; // 0-100
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
