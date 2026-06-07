import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles, Video, VideoOff } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4); // Volume level from 0.0 to 1.0
  const [blockedByBrowser, setBlockedByBrowser] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>([4, 4, 4, 4]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isFirstPlayRef = useRef(true);

  // Audio visualizer simulation for a premium experience
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && !isMuted) {
      interval = setInterval(() => {
        setVisualizerBars([
          Math.floor(Math.random() * 18) + 4,
          Math.floor(Math.random() * 24) + 6,
          Math.floor(Math.random() * 18) + 4,
          Math.floor(Math.random() * 12) + 3,
        ]);
      }, 120);
    } else {
      setVisualizerBars([4, 4, 4, 4]);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isMuted]);

  // Unified postMessage command sender to YouTube Iframe
  const sendPlayerCommand = (command: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            id: 1,
            func: command,
            args: args,
          }),
          '*'
        );
      } catch (err) {
        console.error('Error sending command to YouTube iframe:', err);
      }
    }
  };

  // Synchronize volume and mute states dynamically
  useEffect(() => {
    if (isMuted) {
      sendPlayerCommand('mute');
    } else {
      sendPlayerCommand('unMute');
      sendPlayerCommand('setVolume', [Math.round(volume * 100)]);
    }
  }, [isMuted, volume]);

  const handleTogglePlayback = () => {
    if (isPlaying) {
      sendPlayerCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      if (isFirstPlayRef.current) {
        sendPlayerCommand('seekTo', [60, true]);
        isFirstPlayRef.current = false;
      }
      sendPlayerCommand('playVideo');
      sendPlayerCommand('unMute');
      sendPlayerCommand('setVolume', [Math.round(volume * 100)]);
      setIsMuted(false);
      setIsPlaying(true);
      setBlockedByBrowser(false);
    }
  };

  const handleIframeLoad = () => {
    // Prime-mute and auto-buffer start at 60 seconds marking
    setTimeout(() => {
      sendPlayerCommand('setVolume', [0]);
      sendPlayerCommand('mute');
      sendPlayerCommand('playVideo');
      sendPlayerCommand('seekTo', [60, true]);
    }, 1000);
  };

  // Construct origin-bounded premium video player embed URL
  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = `https://www.youtube.com/embed/Q22DYmlYR30?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=Q22DYmlYR30&start=60&controls=1&showinfo=0&rel=0&modestbranding=1&origin=${encodeURIComponent(originUrl)}`;

  return (
    <>
      {/* 
        PREMIUM DYNAMIC VIDEO/AUDIO HOSTING CONTAINER:
        To satisfy aggressive cross-device browser lifecycle rules, the underlying YouTube iframe
        is kept alive persistently on the DOM. When showVideo is true, it displays as a gorgeous 
        center-placed cards popup. When false, it seamlessly tracks off-screen maintaining playing state.
      */}
      <div
        id="royal-wedding-video-container"
        className={
          showVideo
            ? "fixed bottom-24 right-6 z-50 w-72 sm:w-80 bg-[#052b21] border-2 border-gold-royal/80 rounded-2xl overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.85)] animate-fade-slide-up flex flex-col transition-all duration-300"
            : "fixed -bottom-96 -right-96 w-1 h-1 opacity-0 pointer-events-none overflow-hidden"
        }
      >
        {showVideo && (
          <div className="bg-[#031410] border-b border-gold-royal/20 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gold-bright font-serif text-[11px] sm:text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>ঐতিহ্যবাহী বিয়ের মধুর সানাই সুর</span>
            </div>
            <button 
              onClick={() => setShowVideo(false)}
              className="text-gold-matte hover:text-gold-bright text-[10px] font-sans font-bold cursor-pointer transition px-2 py-0.5 rounded border border-gold-royal/25 hover:border-gold-royal bg-[#052b21]/40"
            >
              বন্ধ করুন✕
            </button>
          </div>
        )}
        
        <div className={showVideo ? "aspect-[16/9] w-full bg-black relative" : "w-full h-full"}>
          <iframe
            ref={iframeRef}
            id="wedding-invitation-yt-player-iframe"
            title="Royal Invitation Wedding Sangeet shehnai background music track player"
            src={embedUrl}
            onLoad={handleIframeLoad}
            className="w-full h-full border-none"
            allow="autoplay; encrypted-media"
          />
        </div>

        {showVideo && (
          <div className="bg-[#052b21] p-2 text-center text-[10px] text-slate-350 font-serif leading-none border-t border-gold-royal/10">
            Traditional Wedding Shehnai Video Performance
          </div>
        )}
      </div>

      {/* 1. AUTOPLAY BROWSER PROMPT BAR (Appears gracefully centered above controller on block state) */}
      {blockedByBrowser && (
        <div id="autoplay-music-prompt-bar" className="fixed bottom-24 right-6 z-50 max-w-xs sm:max-w-sm animate-bounce">
          <button
            onClick={handleTogglePlayback}
            className="flex items-center gap-2.5 bg-[#0d5945] border-2 border-gold-royal text-gold-bright font-sans text-xs p-3 rounded-xl shadow-[0_6px_35px_rgba(212,175,55,0.45)] hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <div className="bg-gold-royal text-emerald-deep p-1.5 rounded-full animate-spin">
              <Music className="w-3.5 h-3.5 text-emerald-deep" />
            </div>
            <div className="text-left font-serif pr-1">
              <p className="font-bold text-gold-bright text-[11px] sm:text-xs">🔊 Tap to Play Royal Wedding Music</p>
              <p className="text-[9px] text-slate-350 mt-0.5">মধুর সানাই সুর শুনতে এখানে ক্লিক করুন</p>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-gold-bright animate-pulse" />
          </button>
        </div>
      )}

      {/* 2. UNIFIED COHESIVE SOUND CONTROLLER (Replaces all previous redundant layout components) */}
      <div 
        id="unified-audio-floating-control"
        className="fixed bottom-6 right-6 z-50 bg-[#052b21]/95 border border-gold-royal/40 rounded-full py-2 px-3 shadow-[0_6px_35px_rgba(0,0,0,0.6)] flex items-center gap-2 sm:gap-3 backdrop-blur-md hover:border-gold-royal transition-all duration-300 font-sans"
      >
        {/* Play/Pause Button containing elegant rotating Mandala Frame */}
        <button
          onClick={handleTogglePlayback}
          className="relative w-10 h-10 rounded-full bg-gold-royal text-emerald-deep flex items-center justify-center hover:brightness-110 active:scale-90 transition cursor-pointer overflow-hidden shadow-md shrink-0"
          title={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
        >
          {/* Inner Mandala SVG background that rotates during playback */}
          <div className={`absolute inset-0.5 rounded-full border border-gold-bright/30 ${isPlaying && !isMuted ? 'animate-[spin_12s_linear_infinite]' : ''}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full text-gold-bright/20">
              <polygon points="50,5 62,38 95,38 68,58 78,90 50,70 22,90 32,58 5,38 38,38" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          
          <div className="relative z-10">
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-emerald-deep" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-deep fill-emerald-deep ml-0.5" />
            )}
          </div>
        </button>

        {/* Traditional Shehnai Text Badge info */}
        <div className="flex flex-col text-left shrink-0 max-w-[80px] sm:max-w-[100px] leading-tight">
          <span className="text-[10px] text-gold-bright font-serif font-bold leading-none flex items-center gap-0.5">
            রয়েল সানাই
          </span>
          <span className="text-[8px] text-slate-400 font-medium tracking-wide">
            {isPlaying ? 'Playing / সচল' : 'Paused / বন্ধ'}
          </span>
        </div>

        {/* Dynamic Sound Waves Visualizer */}
        <div className="flex items-end gap-[2px] h-3.5 w-5 px-0.5 shrink-0" title="Audio Visualizer">
          {visualizerBars.map((h, i) => (
            <div
              key={i}
              className="w-[2px] rounded-sm bg-gradient-to-t from-gold-matte to-gold-bright transition-all duration-[120ms]"
              style={{ height: `${h * 0.5}px` }}
            />
          ))}
        </div>

        {/* Visualizer and Video Divider */}
        <div className="h-4 w-[1px] bg-gold-royal/25 shrink-0" />

        {/* Elegant "ভিডিওর অপশন / Toggle Video displayer Option" */}
        <button
          onClick={() => setShowVideo(!showVideo)}
          className={`px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 transition-all duration-200 cursor-pointer border shrink-0 ${
            showVideo 
              ? 'bg-gold-royal text-emerald-deep border-gold-royal shadow-md' 
              : 'border-gold-royal/30 text-gold-bright hover:border-gold-royal hover:bg-gold-royal/10'
          }`}
          title="Toggle Royal Video Display Panel"
        >
          {showVideo ? <VideoOff className="w-3 h-3 shrink-0" /> : <Video className="w-3 h-3 shrink-0" />}
          <span>{showVideo ? 'ভিডিও বন্ধ করুন' : 'ভিডিও দেখুন'}</span>
        </button>

        {/* Dynamic Volume Mute Toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-gold-matte hover:text-gold-bright transition cursor-pointer p-0.5 shrink-0"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Interactive Volume slider */}
        <div className="flex items-center gap-1 w-12 sm:w-16 group/vol pr-1 shrink-0">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              if (isMuted) setIsMuted(false);
            }}
            className="w-full accent-gold-bright h-[3px] rounded bg-[#031410] border border-gold-royal/10 opacity-75 group-hover/vol:opacity-100 transition cursor-pointer"
            title="Adjust volume"
          />
        </div>
      </div>
    </>
  );
}
