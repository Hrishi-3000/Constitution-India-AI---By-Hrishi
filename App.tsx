
import React, { useState, useEffect, useCallback } from 'react';
import { analyzeQuery } from './services/geminiService';
import { AnalysisResult, HistoryItem } from './types';
import AnalysisCard from './components/AnalysisCard';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lastQuery, setLastQuery] = useState('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('constitution_ai_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('constitution_ai_history', JSON.stringify(history));
  }, [history]);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);
    setCurrentResult(null);
    setLastQuery(query);

    try {
      const result = await analyzeQuery(query);
      setCurrentResult(result);
      
      const newHistoryItem: HistoryItem = {
        ...result,
        id: Math.random().toString(36).substring(7),
        query: query,
        timestamp: Date.now()
      };

      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
      setQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  }, [query, isAnalyzing]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation / Header */}
      <header className="bg-[#1a365d] text-white py-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
            <defs>
              <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 max-w-4xl relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-indigo-400/30">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#1a365d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
               </svg>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Constitution India AI</h1>
          </div>
          <p className="text-indigo-100 text-center max-w-2xl text-xl leading-relaxed">
            Created by <span className="font-bold text-white underline decoration-amber-400 decoration-2 underline-offset-4">Hrishikesh</span> to empower every citizen with constitutional knowledge. <br />
            <span className="italic font-medium text-amber-200 mt-2 block">"We Indians are proud of our vibrant democracy and the great Constitution of India."</span>
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 max-w-4xl py-12">
        {/* Search Bar */}
        <div className="mb-12 relative">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Is right to education a fundamental right?"
              className="w-full px-8 py-6 bg-white rounded-2xl shadow-xl text-xl border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-all duration-300 placeholder:text-slate-400 group-hover:shadow-2xl"
              disabled={isAnalyzing}
            />
            <button
              type="submit"
              disabled={!query.trim() || isAnalyzing}
              className={`absolute right-3 top-3 bottom-3 px-8 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                isAnalyzing 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-[#1a365d] text-white hover:bg-indigo-900 shadow-md hover:shadow-lg active:scale-95'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Consulting...
                </>
              ) : (
                'Consult'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-12 min-h-[400px]">
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-xl shadow-lg animate-shake">
              <p className="text-rose-700 font-bold">Error: {error}</p>
            </div>
          )}

          {isAnalyzing && (
            <AnalysisCard result={{ articles: '', status: '', explanation: '', raw: '', citations: [] }} isLoading={true} />
          )}

          {currentResult && !isAnalyzing && (
            <div className="animate-slideUp">
              <AnalysisCard result={currentResult} query={lastQuery} />
            </div>
          )}

          {/* Preamble Section */}
          {!currentResult && !isAnalyzing && (
            <section className="bg-amber-50/50 border border-amber-200 rounded-3xl p-10 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
              <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center justify-center gap-3">
                <span className="w-10 h-px bg-amber-400"></span>
                THE PREAMBLE
                <span className="w-10 h-px bg-amber-400"></span>
              </h2>
              <p className="text-amber-800 text-lg italic leading-relaxed font-serif max-w-2xl mx-auto">
                "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, LIBERTY, EQUALITY and FRATERNITY..."
              </p>
              <div className="mt-8">
                <span className="inline-block px-4 py-2 bg-amber-200/50 rounded-full text-xs font-bold text-amber-900 uppercase tracking-widest">Satyamev Jayate</span>
              </div>
            </section>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Your History</h2>
                <button onClick={() => { setHistory([]); localStorage.removeItem('constitution_ai_history'); }} className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">Clear</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => { setCurrentResult(item); setLastQuery(item.query); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-all border border-slate-100 text-left group"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl">{item.status}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">{item.query}</p>
                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-slate-500">{item.articles.split(',')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 font-medium mb-4">Dedicated to the Citizens of the Republic of India.</p>
          <div className="flex justify-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600">Rights</a>
            <a href="#" className="hover:text-indigo-600">Duties</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;
