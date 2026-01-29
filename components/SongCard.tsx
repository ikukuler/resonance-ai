import React, { useState } from 'react';
import { Song } from '../types';
import { Play, Disc, Music2, Activity, ExternalLink } from 'lucide-react';
import VibeVisualizer from './VibeVisualizer';
import { useLanguage } from '../contexts/LanguageContext';

interface SongCardProps {
  song: Song;
  index: number;
}

const SongCard: React.FC<SongCardProps> = ({ song, index }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine a color based on energy/valence for the visualizer
  const getThemeColor = () => {
    if (song.features.valence < 40 && song.features.energy < 40) return "#94a3b8"; // Melancholy (Gray/Blue)
    if (song.features.energy > 80) return "#f472b6"; // High Energy (Pink)
    if (song.features.valence > 70) return "#fbbf24"; // Happy (Yellow/Orange)
    if (song.features.acousticness > 70) return "#4ade80"; // Acoustic (Green)
    return "#818cf8"; // Default (Indigo)
  };

  const themeColor = getThemeColor();

  const handleSearch = () => {
    const query = encodeURIComponent(`${song.artist} ${song.title}`);
    // Open Spotify Search
    window.open(`https://open.spotify.com/search/${query}`, '_blank');
  };

  return (
    <div 
      className={`bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-slate-500 hover:shadow-lg ${isExpanded ? 'ring-2 ring-indigo-500/30' : ''}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">
                {song.year}
              </span>
              <span className="text-xs font-medium text-indigo-400 bg-indigo-950/30 px-2 py-0.5 rounded-full">
                {song.genre}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white leading-tight mb-1">{song.title}</h3>
            <p className="text-slate-300 text-lg">{song.artist}</p>
          </div>
          
          <button 
            onClick={handleSearch}
            className="p-3 rounded-full bg-slate-700 hover:bg-[#1DB954] text-white transition-colors flex-shrink-0 group"
            title={t.listenOnSpotify}
          >
            <Play size={20} className="fill-current group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <p className="mt-4 text-slate-400 text-sm leading-relaxed border-l-2 border-slate-600 pl-3 italic">
          "{song.explanation}"
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-500">
           {song.keySignature && (
               <a 
               href={`https://www.google.com/search?q=${encodeURIComponent(song.artist + " " + song.title + " key bpm")}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
               title={t.checkKey}
             >
               <Music2 size={12} />
               <span>{song.keySignature}</span>
             </a>
           )}
           {song.bpm && (
             <a 
               href={`https://www.google.com/search?q=${encodeURIComponent(song.artist + " " + song.title + " key bpm")}`}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
               title={t.checkBpm}
             >
               <Activity size={12} />
               <span>{song.bpm} BPM</span>
             </a>
           )}
        </div>
      </div>

      <div className="bg-slate-900/50 px-5 py-3 border-t border-slate-700/50">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-center text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-colors uppercase tracking-wider font-semibold"
        >
          {isExpanded ? t.hideAnalysis : t.showSpectrum}
          <Disc size={14} className={isExpanded ? "animate-spin" : ""} />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 bg-slate-900 border-t border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 text-center">{t.audioProfile}</h4>
          <VibeVisualizer features={song.features} color={themeColor} />
        </div>
      )}
    </div>
  );
};

export default SongCard;