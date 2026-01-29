
import { GoogleGenAI, Type } from "@google/genai";
import { FarmerProfile, EligibilityResult } from "../types";
import { SCHEME_GUIDELINES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts structured farmer profile from natural language (voice transcription)
 */
export const extractProfileFromText = async (text: string): Promise<Partial<FarmerProfile>> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract a structured farmer profile from this text: "${text}". 
    Return as JSON with: name, state, district, landHolding (number in acres), cropType, category (General/OBC/SC/ST/EWS).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          state: { type: Type.STRING },
          district: { type: Type.STRING },
          landHolding: { type: Type.NUMBER },
          cropType: { type: Type.STRING },
          category: { type: Type.STRING },
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse profile JSON", e);
    return {};
  }
};

/**
 * Checks eligibility using RAG logic against provided guidelines
 */
export const checkEligibility = async (profile: FarmerProfile, schemeId: string): Promise<EligibilityResult> => {
  const guidelines = SCHEME_GUIDELINES[schemeId as keyof typeof SCHEME_GUIDELINES] || "No guidelines found.";
  
  const prompt = `
    Analyze if the following farmer profile is eligible for the scheme based on the guidelines provided.
    
    FARMER PROFILE:
    Name: ${profile.name}
    State: ${profile.state}
    Land Holding: ${profile.landHolding} acres
    Category: ${profile.category}
    Crop: ${profile.cropType}

    SCHEME GUIDELINES:
    ${guidelines}

    Return a JSON response with:
    - isEligible (boolean)
    - benefit (string describing what they get)
    - proofCitation (e.g. "Page 2, Section 4")
    - proofSnippet (Direct quote from the guidelines justifying the decision)
    - nextSteps (array of strings)
    - requiredDocuments (array of strings)
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isEligible: { type: Type.BOOLEAN },
          benefit: { type: Type.STRING },
          proofCitation: { type: Type.STRING },
          proofSnippet: { type: Type.STRING },
          nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
      }
    }
  });

  const data = JSON.parse(response.text);
  return {
    ...data,
    schemeId,
    schemeName: schemeId.toUpperCase()
  };
};

/**
 * Text-to-Speech using Gemini's native audio model
 */
export const generateSpeech = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak in a helpful, friendly voice for a farmer: ${text}` }] }],
      config: {
        responseModalities: ['AUDIO' as any], // Cast due to type conflicts in some SDK versions
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioSrc = `data:audio/pcm;base64,${base64Audio}`;
      // In a real browser environment, PCM requires specific decoding. 
      // For this demo, we use the standard Web Audio API pattern.
      return base64Audio;
    }
  } catch (error) {
    console.error("TTS failed", error);
  }
  return null;
};
