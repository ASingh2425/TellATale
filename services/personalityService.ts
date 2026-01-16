
import { GoogleGenAI, Type } from "@google/genai";
import { SoulTraits, PersonalityProfile, StoryChoice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeSoulShift = async (
  currentProfile: PersonalityProfile,
  choice: StoryChoice,
  history: string
): Promise<PersonalityProfile> => {
  const prompt = `You are a psychological narrative analyzer.
    The player just made this choice: "${choice.text}" (${choice.consequence}).
    Context of their journey so far: ${history}
    Current Personality: ${JSON.stringify(currentProfile.traits)}

    Update their soul traits (0-100) based on this choice. 
    Valiance (bravery), Empathy (kindness), Shadow (selfishness/ruthlessness), Logic (cold reasoning), Chaos (unpredictability).
    Also provide a one-sentence mystical summary of their soul's current state.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          traits: {
            type: Type.OBJECT,
            properties: {
              valiance: { type: Type.NUMBER },
              empathy: { type: Type.NUMBER },
              shadow: { type: Type.NUMBER },
              logic: { type: Type.NUMBER },
              chaos: { type: Type.NUMBER }
            },
            required: ["valiance", "empathy", "shadow", "logic", "chaos"]
          },
          summary: { type: Type.STRING },
          archetypeMatch: { type: Type.STRING }
        },
        required: ["traits", "summary", "archetypeMatch"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
