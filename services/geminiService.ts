
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { StorySegment, StoryConfig, StoryChoice, PersonalityProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateInitialSegment = async (config: StoryConfig): Promise<{ title: string; segment: StorySegment }> => {
  const prompt = `Start a new immersive "${config.genre}" story. 
    Protagonist Name: ${config.protagonistName}. 
    Protagonist Archetype: ${config.archetype}.
    Setting: ${config.setting}. 
    Tone: ${config.tone}.
    
    Instruction: Lean heavily into "${config.genre}" tropes. 
    Provide the story title, the first narrative segment, a visual description for an illustrator, and 3 possible branching choices.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          text: { type: Type.STRING },
          visualPrompt: { type: Type.STRING },
          choices: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                consequence: { type: Type.STRING }
              },
              required: ["text", "consequence"]
            }
          }
        },
        required: ["title", "text", "visualPrompt", "choices"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  return {
    title: data.title,
    segment: {
      id: crypto.randomUUID(),
      text: data.text,
      visualPrompt: data.visualPrompt,
      choices: data.choices
    }
  };
};

export const generateNextSegment = async (
  history: StorySegment[], 
  choice: StoryChoice, 
  config: StoryConfig
): Promise<StorySegment> => {
  const previousText = history.map(s => s.text).slice(-3).join("\n\n");
  
  const prompt = `Continue the story in the "${config.genre}" genre. The reader chose: "${choice.text}" (${choice.consequence}).
    Protagonist: ${config.protagonistName}, acting as the "${config.archetype}".
    
    Context of recent events:
    ${previousText}
    
    Instruction: The narrative should reflect the "soul" of the protagonist. 
    If they are making bold choices, increase the epic scale. If they are logical, add complexity.
    Provide the next narrative segment, a visual description for an illustrator, and 3 new branching choices.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          visualPrompt: { type: Type.STRING },
          choices: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                consequence: { type: Type.STRING }
              },
              required: ["text", "consequence"]
            }
          }
        },
        required: ["text", "visualPrompt", "choices"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  return {
    id: crypto.randomUUID(),
    text: data.text,
    visualPrompt: data.visualPrompt,
    choices: data.choices
  };
};

export const generateIllustration = async (visualPrompt: string): Promise<string | undefined> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `High fantasy/Cinematic style, masterpiece, sharp focus, atmospheric lighting: ${visualPrompt}` }]
    },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  return undefined;
};

export const generateNarration = async (text: string): Promise<string | undefined> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this story segment with a mysterious, captivating voice: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' }
        }
      }
    }
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
