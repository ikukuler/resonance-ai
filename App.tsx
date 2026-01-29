import React, { useState, useRef, useEffect } from 'react';
import { getMusicRecommendations } from './services/geminiService';
import { RecommendationResponse, VibeTag } from './types';
import SongCard from './components/SongCard';
import { Sparkles, Search, Mic2, AlertCircle, Loader2, Music, SlidersHorizontal } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const predefinedTags = Object.values(VibeTag);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null); // Clear previous results for dramatic effect

    try {
      const data = await getMusicRecommendations(prompt);
      setResult(data);
      // Smooth scroll to results after a short delay to allow render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setError("Не удалось получить рекомендации. Попробуйте сформулировать иначе или проверьте API ключ.");
    } finally {
      setLoading(false);
    }
  };

  const addTagToPrompt = (tag: string) => {
    setPrompt(prev => prev ? `${prev}, ${tag.toLowerCase()}` : tag);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl mb-4">
             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <Music size={24} />
             </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Resonance AI
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
            Музыкальный поиск, который понимает контекст. Опишите настроение, цвет звука, гамму или сцену из фильма.
          </p>
        </header>

        {/* Input Section */}
        <section className="max-w-3xl mx-auto mb-20">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-2 shadow-2xl ring-1 ring-white/5">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Например: Мне нужна музыка для ночной поездки под дождем, что-то в стиле нуар-джаза, но с современным басом..."
                className="w-full bg-transparent text-lg text-white placeholder-slate-500 px-6 py-4 rounded-2xl focus:outline-none focus:ring-0 resize-none min-h-[120px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                   <Sparkles size={16} className="text-indigo-400" />
                   <span>AI анализирует контекст</span>
                </div>
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    loading || !prompt.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Поиск...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Найти резонанс
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {predefinedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => addTagToPrompt(tag)}
                className="px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-950/30 border border-red-900/50 text-red-200 rounded-xl flex items-center gap-3 mb-10 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div ref={resultsRef} className="animate-in fade-in duration-700 slide-in-from-bottom-8">
            <div className="mb-10 text-center">
              <div className="inline-block px-4 py-1 rounded-full bg-indigo-950/50 border border-indigo-900 text-indigo-300 text-sm font-medium mb-4">
                Анализ запроса
              </div>
              <p className="text-xl md:text-2xl text-slate-200 leading-relaxed max-w-4xl mx-auto font-light">
                {result.analysis}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.songs.map((song, idx) => (
                <SongCard key={`${song.title}-${idx}`} song={song} index={idx} />
              ))}
            </div>

            <div className="mt-20 text-center pb-10">
              <p className="text-slate-600 text-sm">
                Рекомендации сгенерированы Gemini 2.5 Flash. Музыкальные параметры являются оценочными.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;