
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

  // Load history from localStorage
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

  // Save history to localStorage
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

      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // Keep last 10
      setQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  }, [query, isAnalyzing]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('constitution_ai_history');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] text-slate-900">
      {/* Navigation / Header */}
      <header className="bg-[#1a365d] text-white py-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
            <defs>
              <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 max-w-4xl relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-[#1a365d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
               </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Constitution India AI</h1>
          </div>
          <p className="text-indigo-100 text-center max-w-2xl text-lg leading-relaxed">
            Created by <span className="font-bold text-white underline decoration-indigo-400">Hrishikesh</span> to empower every citizen with constitutional knowledge. <br />
            <span className="italic font-medium">We Indians are proud of our vibrant democracy and the great Constitution of India.</span>
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
              placeholder="e.g., Do I have freedom of speech? or Is child labor legal?"
              className="w-full pl-6 pr-20 py-5 bg-white rounded-2xl shadow-xl text-xl border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-all duration-300 placeholder:text-slate-400 group-hover:shadow-2xl"
              disabled={isAnalyzing}
            />
            <button
              type="submit"
              disabled={!query.trim() || isAnalyzing}
              className={`absolute right-3 top-3 bottom-3 px-8 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                isAnalyzing 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-[#1a365d] text-white hover:bg-indigo-900 shadow-md hover:shadow-lg'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </>
              ) : (
                'Consult'
              )}
            </button>
          </form>
          
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
            <span className="font-semibold uppercase text-xs tracking-wider opacity-60">Trending:</span>
            {['Right to Privacy', 'Gender Equality', 'Freedom of Press', 'Reservation Laws'].map((tag) => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); }}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8 min-h-[400px]">
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-xl shadow-md">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-rose-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-rose-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <AnalysisCard result={{ articles: '', status: '', explanation: '', raw: '', citations: [] }} isLoading={true} />
          )}

          {currentResult && !isAnalyzing && (
            <AnalysisCard result={currentResult} query={lastQuery} />
          )}

          {!currentResult && !isAnalyzing && !error && history.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-500 mb-2">No active inquiry</h3>
              <p className="text-slate-400 max-w-xs mx-auto">Enter a question about your rights or the Indian Constitution above to begin.</p>
            </div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Recent Inquiries</h2>
                <button 
                  onClick={clearHistory}
                  className="text-xs font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear History
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all cursor-pointer border border-slate-100 group"
                    onClick={() => {
                        setCurrentResult(item);
                        setLastQuery(item.query);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xl">{item.status}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-800 font-semibold mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {item.query}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.articles.split(',').slice(0, 2).map((art, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 font-bold border border-slate-200">
                          {art.trim()}
                        </span>
                      ))}
                      {item.articles.split(',').length > 2 && (
                        <span className="text-[10px] text-slate-400 font-bold">+ {item.articles.split(',').length - 2} more</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-4">
            &copy; {new Date().getFullYear()} Constitution India AI. This application provides educational information and is not a substitute for professional legal advice.
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Terms of Use</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Legal Resources</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
