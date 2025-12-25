
import React, { useState } from 'react';
import { AnalysisResult } from '../types';

interface AnalysisCardProps {
  result: AnalysisResult;
  query?: string;
  isLoading?: boolean;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ result, query, isLoading }) => {
  const [showCitations, setShowCitations] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-8 animate-pulse border border-slate-200">
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
        <div className="h-8 bg-slate-200 rounded w-full mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-4/6"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status.includes('✅')) return 'border-emerald-500 bg-emerald-50 text-emerald-800';
    if (status.includes('❌')) return 'border-rose-500 bg-rose-50 text-rose-800';
    return 'border-amber-500 bg-amber-50 text-amber-800';
  };

  const getStatusLabel = (status: string) => {
    if (status.includes('✅')) return 'Constitutionally Protected';
    if (status.includes('❌')) return 'Violation / Prohibited';
    return 'Depends on Context / Restrictions Apply';
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 transform">
      <div className={`px-6 py-4 border-b ${getStatusColor(result.status)} flex items-center justify-between`}>
        <div className="flex items-center">
          <span className="text-2xl mr-3">{result.status}</span>
          <span className="font-semibold text-lg tracking-tight uppercase">{getStatusLabel(result.status)}</span>
        </div>
        <div className="hidden sm:block">
            <span className="text-xs opacity-70 uppercase font-bold tracking-widest">Legal Status</span>
        </div>
      </div>
      
      <div className="p-8">
        {query && (
          <div className="mb-6">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">User Inquiry</h3>
            <p className="text-slate-700 italic text-lg leading-relaxed">"{query}"</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Relevant Article(s)</h3>
          <div className="flex flex-wrap gap-2">
            {result.articles.split(',').map((art, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {art.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Simplified Explanation</h3>
          <p className="text-slate-800 text-lg leading-relaxed font-medium">
            {result.explanation}
          </p>
        </div>

        {result.citations && result.citations.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <button 
              onClick={() => setShowCitations(!showCitations)}
              className="flex items-center justify-between w-full text-left group"
            >
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View Official Article Source (Citations)
              </h3>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${showCitations ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showCitations && (
              <div className="mt-4 space-y-4 animate-fadeIn">
                {result.citations.map((citation, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <h4 className="text-indigo-700 font-bold text-sm mb-2 uppercase tracking-wide">{citation.article}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed font-serif italic">
                      "{citation.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
         <span className="text-slate-400 text-xs italic">Data generated by AI expert trained on Indian Constitution</span>
         <button 
           onClick={() => window.print()} 
           className="text-slate-500 hover:text-indigo-600 transition-colors"
           title="Print analysis"
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
           </svg>
         </button>
      </div>
    </div>
  );
};

export default AnalysisCard;
