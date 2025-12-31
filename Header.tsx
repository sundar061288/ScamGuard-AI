
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="gradient-bg text-white py-8 px-4 shadow-xl border-b border-blue-900/50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <i className="fa-solid fa-shield-halved text-2xl"></i>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ScamGuard <span className="text-blue-400">AI</span></h1>
            <p className="text-blue-200 text-sm opacity-80 uppercase tracking-widest font-semibold">Your Personal AI Security Analyst</p>
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            System Active
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
