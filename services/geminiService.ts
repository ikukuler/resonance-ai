import { RecommendationResponse } from "../types";
import { Language } from "../locales";

// In production (Vercel), use relative path. In development, use local server
const API_URL = import.meta.env.PROD 
  ? '' // Use relative path in production (Vercel handles routing)
  : (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3001';

export const getMusicRecommendations = async (prompt: string, language: Language = 'en'): Promise<RecommendationResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, language }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as RecommendationResponse;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};