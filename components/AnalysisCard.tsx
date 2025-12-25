
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { generateSpeech } from '../services/geminiService';

interface AnalysisCardProps {
  result: AnalysisResult;
  query?: string;
  isLoading?: boolean;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ result, query, isLoading }) => {
  const [showCitations, setShowCitations] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handlePlayAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const base64 = await generateSpeech(result.explanation);
      const audioBlob = await fetch(`data:audio/pcm;base64,${base64}`).then(res => res.blob());
      
      // Decoding raw PCM manually as per guidelines
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(arrayBuffer);
      const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
    } catch (err) {
      console.error("Audio playback failed", err);
      setIsPlaying(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
    <div className="w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300">
      <div className={`px-6 py-4 border-b ${getStatusColor(result.status)} flex items-center justify-between`}>
        <div className="flex items-center">
          <span className="text-2xl mr-3">{result.status}</span>
          <span className="font-semibold text-lg tracking-tight uppercase">{getStatusLabel(result.status)}</span>
        </div>
        <button 
          onClick={handlePlayAudio}
          disabled={isPlaying}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${isPlaying ? 'bg-indigo-100 text-indigo-400' : 'bg-white/50 hover:bg-white text-indigo-700 shadow-sm'}`}
        >
          {isPlaying ? (
            <span className="flex items-center gap-1">
              <span className="animate-bounce inline-block w-1 h-3 bg-indigo-400 rounded-full"></span>
              <span className="animate-bounce delay-75 inline-block w-1 h-3 bg-indigo-400 rounded-full"></span>
              <span className="animate-bounce delay-150 inline-block w-1 h-3 bg-indigo-400 rounded-full"></span>
              Speaking...
            </span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              Listen
            </>
          )}
        </button>
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
              <div className="mt-4 space-y-4">
                {result.citations.map((citation, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-100 relative group/citation">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-indigo-700 font-bold text-sm uppercase tracking-wide">{citation.article}</h4>
                      <button 
                        onClick={() => copyToClipboard(citation.text, idx)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Copy text"
                      >
                        {copiedIndex === idx ? (
                          <span className="text-[10px] font-bold text-emerald-500">COPIED!</span>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        )}
                      </button>
                    </div>
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
    </div>
  );
};

export default AnalysisCard;
