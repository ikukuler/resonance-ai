import { GoogleGenAI } from "@google/genai";

const getLanguageName = (lang) => {
  const languageMap = {
    en: 'English',
    ru: 'Russian',
    ro: 'Romanian',
  };
  return languageMap[lang] || 'English';
};

// Define the schema for structured output using JSON Schema format
const songSchema = {
  type: "object",
  properties: {
    title: { type: "string", description: "Song title (Must be a real, existing track)" },
    artist: { type: "string", description: "Artist name (Must be a real, existing artist)" },
    year: { type: "string", description: "Release year" },
    genre: { type: "string", description: "Primary genre" },
    explanation: { type: "string", description: "A concise reason why this song matches the user's specific obscure request." },
    keySignature: { type: "string", description: "Musical key (e.g., C# Minor)" },
    bpm: { type: "number", description: "Tempo in Beats Per Minute" },
    features: {
      type: "object",
      description: "Estimated audio characteristics from 0 to 100",
      properties: {
        energy: { type: "number" },
        valence: { type: "number" },
        acousticness: { type: "number" },
        danceability: { type: "number" },
        complexity: { type: "number" },
      },
      required: ["energy", "valence", "acousticness", "danceability", "complexity"]
    }
  },
  required: ["title", "artist", "year", "genre", "explanation", "features"]
};

const responseSchema = {
  type: "object",
  properties: {
    analysis: { type: "string", description: "A short musicological breakdown of what the user is looking for (e.g., 'You are looking for high-tempo tracks with minor scales typical of 80s synthwave')." },
    songs: {
      type: "array",
      items: songSchema,
    }
  },
  required: ["analysis", "songs"]
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, language = 'en' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const languageName = getLanguageName(language);

    const systemInstruction = `
    You are an expert Musicologist and Sonic Curator with encyclopedic knowledge of music theory, history, and production techniques.
    
    The user is looking for music recommendations based on abstract concepts, moods, musical keys, production styles, or specific "vibes".
    
    Your goal is to:
    1. Analyze the user's request deeply. If they say "purple sound", interpret what that synesthesia means musically (maybe deep synth bass, reverb).
    2. Recommend 5-8 distinct, REAL, and EXISTING songs that fit this criteria perfectly.
    3. CRITICAL: Do NOT invent or hallucinate songs. Only recommend songs that definitely exist and can be found on Spotify. Include not only the most popular songs, but also some obscure ones. Include songs in the user's language if it's relevant to the request.
    4. ACCURACY MATTERS: Provide accurate Key and BPM. Use your internal knowledge to retrieve the correct studio version metadata. If the song is "stomp claps", ensure the BPM matches that genre standard.
    5. Provide estimated audio features (Energy, Valence, etc.) for visualization.
    6. Ensure the list is diverse unless specifically restricted by the user.
    
    Language: The content of the response (titles/artists) should be original and accurate English names, but the 'analysis' and 'explanation' fields must be written in ${languageName}. Always respond in ${languageName} for these fields.
  `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(text);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: "Failed to get recommendations", 
      message: error.message 
    });
  }
}
