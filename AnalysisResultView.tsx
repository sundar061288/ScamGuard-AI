
import React from 'react';
import { AnalysisResult, RiskScore } from '../types';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisResultView: React.FC<Props> = ({ result, onReset }) => {
  const getRiskColor = (score: RiskScore) => {
    switch (score) {
      case RiskScore.HIGH: return 'text-red-600 bg-red-50 border-red-200';
      case RiskScore.MEDIUM: return 'text-amber-600 bg-amber-50 border-amber-200';
      case RiskScore.LOW: return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (score: RiskScore) => {
    switch (score) {
      case RiskScore.HIGH: return 'fa-circle-exclamation';
      case RiskScore.MEDIUM: return 'fa-triangle-exclamation';
      case RiskScore.LOW: return 'fa-circle-check';
      default: return 'fa-circle-info';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`p-6 rounded-2xl border-2 mb-6 ${getRiskColor(result.risk_score)} shadow-sm`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <i className={`fa-solid ${getRiskIcon(result.risk_score)} text-3xl`}></i>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider opacity-70">Risk Assessment</p>
              <h2 className="text-2xl font-black">{result.risk_score.toUpperCase()}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold uppercase tracking-wider opacity-70">Scam Category</p>
            <p className="text-lg font-bold">{result.scam_type}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-900 font-bold flex items-center gap-2 mb-4">
            <i className="fa-solid fa-flag text-red-500"></i>
            Red Flags Detected
          </h3>
          <ul className="space-y-3">
            {result.red_flags.map((flag, idx) => (
              <li key={idx} className="flex gap-3 text-slate-600 text-sm">
                <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-[10px] mt-0.5">
                  <i className="fa-solid fa-xmark"></i>
                </span>
                {flag}
              </li>
            ))}
            {result.red_flags.length === 0 && (
              <li className="text-slate-400 italic text-sm">No suspicious elements found.</li>
            )}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-900 font-bold flex items-center gap-2 mb-4">
            <i className="fa-solid fa-user-shield text-blue-500"></i>
            Analyst Advice
          </h3>
          <div className="bg-blue-50 p-4 rounded-xl text-blue-900 text-sm leading-relaxed border border-blue-100">
            {result.advice}
          </div>
        </div>
      </div>

      {result.sources && result.sources.length > 0 && (
        <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-slate-900 font-bold flex items-center gap-2 mb-4">
            <i className="fa-solid fa-link text-indigo-500"></i>
            Verification Sources
          </h3>
          <div className="space-y-2">
            {result.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all group"
              >
                <span className="text-sm font-medium truncate pr-4">{source.title}</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-slate-300 group-hover:text-blue-500 text-xs"></i>
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-magnifying-glass-plus"></i>
        Start New Analysis
      </button>
    </div>
  );
};

export default AnalysisResultView;
