
import React, { useState, useEffect } from 'react';

const Loader: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);
  const messages = [
    "Initializing Forensic Scan...",
    "Analyzing Metadata and Headers...",
    "Scanning for Social Engineering Patterns...",
    "Comparing with Global Scam Database...",
    "Identifying Urgency and Authority Cues...",
    "Verifying Links and Sender Authenticity...",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fa-solid fa-user-secret text-3xl text-blue-600"></i>
        </div>
      </div>
      <p className="text-slate-900 font-bold text-lg mb-2">{messages[msgIdx]}</p>
      <p className="text-slate-500 text-sm text-center">Our AI analyst is performing a deep security audit.</p>
    </div>
  );
};

export default Loader;
