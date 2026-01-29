export interface AudioFeatures {
  energy: number;      // 0-100: Intensity, activity
  valence: number;     // 0-100: Musical positiveness (Happy vs Sad)
  acousticness: number; // 0-100: Acoustic vs Electronic
  danceability: number; // 0-100: Suitability for dancing
  complexity: number;   // 0-100: Simple structure vs Prog/Jazz
}

export interface Song {
  title: string;
  artist: string;
  year: string;
  genre: string;
  explanation: string; // Why this song fits the specific prompt
  features: AudioFeatures;
  keySignature?: string; // e.g., "C Minor"
  bpm?: number;
}

export interface RecommendationResponse {
  analysis: string; // Brief analysis of what the user asked for
  songs: Song[];
}

export enum VibeTag {
  MELANCHOLIC = "MELANCHOLIC",
  AGGRESSIVE = "AGGRESSIVE",
  DREAMY = "DREAMY",
  NOSTALGIC = "NOSTALGIC",
  CYBERPUNK = "CYBERPUNK",
  LOFI = "LOFI",
  JAZZY = "JAZZY",
  DARK = "DARK",
  EUPHORIC = "EUPHORIC"
}