import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { INITIAL_INVITATION_DATA } from './constants';
import { InvitationData, CardTheme } from './types';
import InvitationCard from './components/InvitationCard';
import ControlPanel from './components/ControlPanel';
import AudioPlayer from './components/AudioPlayer';

export default function App() {
  const [data] = useState<InvitationData>(INITIAL_INVITATION_DATA);
  const [theme, setTheme] = useState<CardTheme>(() => {
    return (localStorage.getItem('applied_wedding_theme') as CardTheme) || 'emerald-gold';
  });
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  
  // Reference for capturing pixel perfect images
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isInvite = params.get('invite') === 'true';
      const urlTheme = params.get('theme') as CardTheme | null;
      
      setIsGuestMode(isInvite);
      if (urlTheme && ['emerald-gold', 'royal-dark', 'ivory-gold', 'crimson-gold'].includes(urlTheme)) {
        setTheme(urlTheme);
      }
    }
  }, []);

  return (
    <div id="full-applet-viewport" className="min-h-screen bg-[#031410] text-[#E2E8F0] relative overflow-x-hidden pb-12 flex flex-col justify-between">
      {/* Background traditional music component */}
      <AudioPlayer />

      {/* Abstract Background Islamic Art Pattern */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] opacity-[0.03] select-none pointer-events-none transform translate-x-32 -translate-y-32">
        <svg fill="currentColor" viewBox="0 0 100 100" className="text-gold-royal">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
          <polygon points="50,5 60,35 90,35 65,55 75,85 50,65 25,85 35,55 10,35 40,35" stroke="currentColor" fill="none"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] opacity-[0.03] select-none pointer-events-none transform -translate-x-32 translate-y-32">
        <svg fill="currentColor" viewBox="0 0 100 100" className="text-gold-royal">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
          <polygon points="50,5 60,35 90,35 65,55 75,85 50,65 25,85 35,55 10,35 40,35" stroke="currentColor" fill="none"/>
        </svg>
      </div>

      {/* Floating Design Studio launcher button for creators when in guest invite mode */}
      {isGuestMode && (
        <div className="absolute top-4 left-4 z-40">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = window.location.origin + window.location.pathname;
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d5945]/70 hover:bg-[#0d5945] border border-gold-royal/35 text-gold-bright text-[11px] font-sans font-bold transition-all shadow-lg active:scale-95 duration-200 cursor-pointer backdrop-blur-sm hover:border-gold-royal"
            title="Create your custom luxury wedding invitation card"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Design Custom Card (কার্ড এডিটর)</span>
          </button>
        </div>
      )}

      {/* Premium Header Banner (Displays depending on guest versus design workbench mode) */}
      {!isGuestMode ? (
        <header id="wedding-header" className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-10 md:pt-16 text-center flex flex-col items-center">
          <div id="main-badge" className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold rounded-full bg-gold-deep/15 border border-gold-royal text-gold-bright uppercase tracking-widest leading-none mb-3 animate-pulse-gold">
            <Heart className="w-3.5 h-3.5 fill-gold-royal text-gold-bright" />
            The Holy Nikah of Ataur &amp; Mahdia
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl md:text-5xl text-gold-bright tracking-tight gold-text-gradient py-1 animate-fade-slide-up">
            Royal Invitation Themes
          </h1>
          <p className="font-sans text-xs sm:text-sm text-slate-350 max-w-xl mt-2 leading-relaxed">
            Select elegant custom templates for the royal wedding invitation of Md. Ataur Rahman &amp; Mahdia Akter. Customize themes, preview them in real time, and export invitation cards in pristine ultra resolution!
          </p>
        </header>
      ) : (
        <header id="wedding-header" className="relative z-10 w-full max-w-xl mx-auto px-4 pt-10 text-center flex flex-col items-center">
          <div id="main-badge" className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold rounded-full bg-gold-deep/15 border border-gold-royal text-gold-bright uppercase tracking-widest leading-none mb-2 animate-pulse-gold">
            <Heart className="w-3.5 h-3.5 fill-gold-royal text-gold-bright animate-pulse" />
            Royal Nikah Invitation / নিকা মহফেল নিমন্ত্রণ
          </div>
        </header>
      )}

      {/* Main Workspace Layout vs Splendid Standalone Center Card */}
      {!isGuestMode ? (
        <main className="relative z-10 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-8 mb-12 flex-grow">
          
          {/* Left Section: Royal Invitation Card Frame / Theme Preview (Column size: 6) */}
          <div className="lg:col-span-6 flex flex-col items-center gap-4 bg-[#052b21]/30 border border-gold-royal/15 rounded-2xl p-5 backdrop-blur-md shadow-2xl h-full justify-center">
            <h2 className="font-display font-semibold text-xs sm:text-sm tracking-widest text-gold-matte uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-royal animate-bounce" /> Theme Preview
            </h2>
            
            {/* Card Wrapper with Aspect Ratio Bounds */}
            <div className="w-full flex justify-center py-2 relative group max-w-[480px]">
              {/* Elegant glowing background highlight */}
              <div className="absolute inset-0 bg-gold-royal/5 rounded-2xl blur-xl group-hover:bg-gold-royal/10 transition-all duration-300" />
              <InvitationCard data={data} lang="bilingual" theme={theme} cardRef={cardContainerRef} />
            </div>

            <p className="text-[10px] text-slate-400 text-center font-mono italic">
              💡 Switch theme colors to preview the velvet borders and corner vectors
            </p>
          </div>

          {/* Right Section: Integrated Themes Control Panel (Column size: 6) */}
          <div id="interactive-controls-container" className="lg:col-span-6 flex flex-col gap-6">
            <ControlPanel 
              data={data} 
              theme={theme} 
              onChangeTheme={setTheme} 
              cardRef={cardContainerRef} 
            />
          </div>

        </main>
      ) : (
        <main className="relative z-10 w-full max-w-2xl mx-auto px-4 flex flex-col items-center justify-center mt-6 mb-12 flex-grow">
          {/* Standalone gorgeous display centered in guest frame */}
          <div className="w-full flex justify-center py-2 relative group max-w-[480px]">
            {/* Elegant glowing celestial aura */}
            <div className="absolute inset-0 bg-gold-royal/10 rounded-2xl blur-2xl animate-pulse-gold duration-[8000ms]" />
            <InvitationCard data={data} lang="bilingual" theme={theme} cardRef={cardContainerRef} />
          </div>
        </main>
      )}

      {/* Clean Full Width Footer */}
      <footer id="applet-footer" className="relative z-10 w-full text-center py-8 border-t border-gold-royal/10 text-slate-400 text-xs px-4">
        <p className="font-serif italic text-gold-matte text-sm">
          "Barakallahu lakuma wa baraka 'alaykuma wa jama'a baynakuma fee khayr"
        </p>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-sans">
          Exclusive Royal Collection • Md. Ataur Rahman &amp; Mahdia Akter Wedding
        </p>
      </footer>
    </div>
  );
}
