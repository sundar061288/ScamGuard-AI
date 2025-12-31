
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import AnalysisResultView from './components/AnalysisResultView';
import { analyzeContent } from './services/geminiService';
import { AnalysisState, InputMode } from './types';

const App: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    result: null,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (inputMode === 'text' && !textInput.trim()) return;
    if (inputMode === 'image' && !imagePreview) return;
    if (inputMode === 'link' && !urlInput.trim()) return;

    setState({ loading: true, result: null, error: null });

    try {
      const input = 
        inputMode === 'text' ? textInput : 
        inputMode === 'link' ? urlInput : 
        (imagePreview as string);
        
      const result = await analyzeContent(input, inputMode);
      setState({ loading: false, result, error: null });
    } catch (err: any) {
      setState({ loading: false, result: null, error: err.message });
    }
  };

  const reset = () => {
    setTextInput('');
    setUrlInput('');
    setImagePreview(null);
    setState({ loading: false, result: null, error: null });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Personal Security Audit</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Identify fraud instantly. Paste suspicious text, investigate a URL, or upload a screenshot for a deep forensic scan.
          </p>
        </div>

        {state.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <i className="fa-solid fa-circle-exclamation text-xl"></i>
            <p className="font-medium">{state.error}</p>
          </div>
        )}

        {state.loading ? (
          <Loader />
        ) : state.result ? (
          <AnalysisResultView result={state.result} onReset={reset} />
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="flex border-b border-slate-100 flex-wrap">
              <button
                onClick={() => setInputMode('text')}
                className={`flex-1 min-w-[120px] py-5 px-4 font-bold flex items-center justify-center gap-2 transition-all ${
                  inputMode === 'text' 
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <i className="fa-solid fa-align-left"></i>
                Paste Text
              </button>
              <button
                onClick={() => setInputMode('link')}
                className={`flex-1 min-w-[120px] py-5 px-4 font-bold flex items-center justify-center gap-2 transition-all ${
                  inputMode === 'link' 
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <i className="fa-solid fa-globe"></i>
                Link Investigator
              </button>
              <button
                onClick={() => setInputMode('image')}
                className={`flex-1 min-w-[120px] py-5 px-4 font-bold flex items-center justify-center gap-2 transition-all ${
                  inputMode === 'image' 
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <i className="fa-solid fa-image"></i>
                Screenshot
              </button>
            </div>

            <div className="p-8">
              {inputMode === 'text' && (
                <div className="space-y-4">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste the suspicious message or email content here..."
                    className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none text-slate-800"
                  />
                  <button
                    onClick={handleScan}
                    disabled={!textInput.trim()}
                    className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
                      textInput.trim() 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <i className="fa-solid fa-shield-virus"></i>
                    Analyze Text
                  </button>
                </div>
              )}

              {inputMode === 'link' && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <i className="fa-solid fa-link text-slate-400"></i>
                    </div>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example-secure-login.com"
                      className="w-full py-6 pl-14 pr-6 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-800 font-medium"
                    />
                  </div>
                  <p className="text-sm text-slate-400 px-2 italic">
                    <i className="fa-solid fa-info-circle mr-1"></i>
                    ScamGuard will use Google Search to investigate this domain for you.
                  </p>
                  <button
                    onClick={handleScan}
                    disabled={!urlInput.trim()}
                    className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
                      urlInput.trim() 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <i className="fa-solid fa-magnifying-glass-location"></i>
                    Investigate URL
                  </button>
                </div>
              )}

              {inputMode === 'image' && (
                <div className="space-y-6 text-center">
                  {!imagePreview ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-4 border-dashed border-slate-200 rounded-3xl p-12 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all group"
                    >
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400"></i>
                      </div>
                      <p className="text-slate-900 font-bold text-lg">Upload Screenshot</p>
                      <p className="text-slate-500">Attach a screenshot of the suspicious content</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative group max-w-sm mx-auto">
                        <img 
                          src={imagePreview} 
                          alt="Scan preview" 
                          className="w-full h-auto rounded-2xl shadow-lg border-4 border-white" 
                        />
                        <button 
                          onClick={() => setImagePreview(null)}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                      <button
                        onClick={handleScan}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg"
                      >
                        <i className="fa-solid fa-shield-virus"></i>
                        Analyze Screenshot
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <i className="fa-solid fa-user-check"></i>
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Empathetic Analysis</h4>
            <p className="text-slate-500 text-sm">We explain the psychological tricks scammers use to manipulate emotions.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-4">
              <i className="fa-solid fa-globe"></i>
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Web Grounding</h4>
            <p className="text-slate-500 text-sm">Real-time web search to verify links and cross-check known phishing domains.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <i className="fa-solid fa-fingerprint"></i>
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Vision Detection</h4>
            <p className="text-slate-500 text-sm">Analyze UI patterns, fake logos, and visual social engineering in screenshots.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
          <p>© 2024 ScamGuard AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors uppercase font-bold tracking-widest">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors uppercase font-bold tracking-widest">Security Basics</a>
            <a href="#" className="hover:text-slate-600 transition-colors uppercase font-bold tracking-widest">Report Fraud</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
