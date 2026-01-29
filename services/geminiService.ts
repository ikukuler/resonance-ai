import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RecommendationResponse } from "../types";

const apiKey = process.env.API_KEY;

// Define the schema for structured output
const songSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Song title (Must be a real, existing track)" },
    artist: { type: Type.STRING, description: "Artist name (Must be a real, existing artist)" },
    year: { type: Type.STRING, description: "Release year" },
    genre: { type: Type.STRING, description: "Primary genre" },
    explanation: { type: Type.STRING, description: "A concise reason why this song matches the user's specific obscure request." },
    keySignature: { type: Type.STRING, description: "Musical key (e.g., C# Minor)" },
    bpm: { type: Type.NUMBER, description: "Tempo in Beats Per Minute" },
    features: {
      type: Type.OBJECT,
      description: "Estimated audio characteristics from 0 to 100",
      properties: {
        energy: { type: Type.NUMBER },
        valence: { type: Type.NUMBER },
        acousticness: { type: Type.NUMBER },
        danceability: { type: Type.NUMBER },
        complexity: { type: Type.NUMBER },
      },
      required: ["energy", "valence", "acousticness", "danceability", "complexity"]
    }
  },
  required: ["title", "artist", "year", "genre", "explanation", "features"]
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: { type: Type.STRING, description: "A short musicological breakdown of what the user is looking for (e.g., 'You are looking for high-tempo tracks with minor scales typical of 80s synthwave')." },
    songs: {
      type: Type.ARRAY,
      items: songSchema,
    }
  },
  required: ["analysis", "songs"]
};

export const getMusicRecommendations = async (prompt: string): Promise<RecommendationResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert Musicologist and Sonic Curator with encyclopedic knowledge of music theory, history, and production techniques.
    
    The user is looking for music recommendations based on abstract concepts, moods, musical keys, production styles, or specific "vibes".
    
    Your goal is to:
    1. Analyze the user's request deeply. If they say "purple sound", interpret what that synesthesia means musically (maybe deep synth bass, reverb).
    2. Recommend 5-8 distinct, REAL, and EXISTING songs that fit this criteria perfectly.
    3. CRITICAL: Do NOT invent or hallucinate songs. Only recommend songs that definitely exist and can be found on Spotify. Include not only the most popular songs, but also some obscure ones. Inlcude songs in Russinan if it's relevant to the request.
    4. ACCURACY MATTERS: Provide accurate Key and BPM. Use your internal knowledge to retrieve the correct studio version metadata. If the song is "stomp claps", ensure the BPM matches that genre standard.
    5. Provide estimated audio features (Energy, Valence, etc.) for visualization.
    6. Ensure the list is diverse unless specifically restricted by the user.
    
    Language: The content of the response (titles/artists) should be original and accurate English names, but the 'analysis' and 'explanation' should be in RUSSIAN.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Upgraded to Pro model for better knowledge retrieval
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for more factual metadata
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as RecommendationResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};