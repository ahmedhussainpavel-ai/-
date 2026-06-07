import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4); // Volume level from 0.0 to 1.0
  const [blockedByBrowser, setBlockedByBrowser] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>([4, 4, 4, 4]);

  // YouTube API Player and state references
  const playerRef = useRef<any>(null);
  const isPlayerReadyRef = useRef(false);
  const fadeIntervalRef = useRef<any>(null);
  const isFirstPlayRef = useRef(true);

  // Audio visualizer bars simulation for cosmetic layout premium feel
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && !isMuted) {
      interval = setInterval(() => {
        setVisualizerBars([
          Math.floor(Math.random() * 25) + 6,
          Math.floor(Math.random() * 32) + 8,
          Math.floor(Math.random() * 25) + 6,
          Math.floor(Math.random() * 18) + 4,
        ]);
      }, 120);
    } else {
      setVisualizerBars([4, 4, 4, 4]);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isMuted]);

  // Programmatically fade the player volume to sound premium and soft
  const fadeVolume = (from: number, to: number, duration: number, onComplete?: () => void) => {
    if (!playerRef.current || !isPlayerReadyRef.current) {
      onComplete?.();
      return;
    }

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const steps = 15;
    const stepTime = duration / steps;
    let currentVolume = from;
    const delta = (to - from) / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentVolume += delta;
      currentStep++;

      const roundedVol = Math.max(0, Math.min(100, Math.round(currentVolume)));
      
      try {
        if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
          playerRef.current.setVolume(roundedVol);
        }
      } catch (err) {
        console.error('Volume fading tick error:', err);
      }

      if (currentStep >= steps) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        if (onComplete) onComplete();
      }
    }, stepTime);
  };

  // Immediate volume adjustments when not mid-fade
  useEffect(() => {
    if (playerRef.current && isPlayerReadyRef.current) {
      if (!fadeIntervalRef.current) {
        const targetVolume = isMuted ? 0 : Math.round(volume * 100);
        try {
          playerRef.current.setVolume(targetVolume);
        } catch (err) {
          console.error('Error applying direct volume update:', err);
        }
      }
    }
  }, [volume, isMuted]);

  // Master YouTube Player controls
  const handleTogglePlayback = () => {
    if (!playerRef.current || !isPlayerReadyRef.current) {
      return;
    }

    try {
      if (isPlaying) {
        // Smooth fade-out before pausing for a premium feeling
        const currentVol = isMuted ? 0 : Math.round(volume * 100);
        fadeVolume(currentVol, 0, 600, () => {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        });
      } else {
        // Set first play seek
        if (isFirstPlayRef.current) {
          playerRef.current.seekTo(60);
          isFirstPlayRef.current = false;
        }
        playerRef.current.playVideo();
        setBlockedByBrowser(false);
        setIsPlaying(true);

        const targetVol = isMuted ? 0 : Math.round(volume * 100);
        fadeVolume(0, targetVol, 1200);
      }
    } catch (err) {
      console.error('Failed toggling playback on YouTube Player:', err);
    }
  };

  useEffect(() => {
    const onYTReady = () => {
      if (playerRef.current) return; // Prevent double instantiation

      try {
        playerRef.current = new window.YT.Player('wedding-invitation-yt-player', {
          videoId: 'Q22DYmlYR30',
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: 'Q22DYmlYR30', // Needed for infinite loop
            controls: 0,
            showinfo: 0,
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            start: 60, // Starts at 60 seconds natively
          },
          events: {
            onReady: (event: any) => {
              isPlayerReadyRef.current = true;
              event.target.setVolume(0); // Autoplay must always be muted initially to prevent browser blocking
              event.target.seekTo(60);   // Seek to the 60-second mark
              
              // Attempt autoplay with brief delay
              setTimeout(() => {
                try {
                  event.target.playVideo();
                  
                  // Verification fallback check
                  setTimeout(() => {
                    if (playerRef.current) {
                      const state = playerRef.current.getPlayerState();
                      // State 1 = PLAYING
                      if (state !== 1) {
                        setBlockedByBrowser(true);
                        setIsPlaying(false);
                      } else {
                        // Successfully autoplayed. We now prompt the user to act or unmute
                        // Since most modern browsers block silent unmuting on load, we show the prompt to grant a reliable audio experience.
                        setBlockedByBrowser(true);
                      }
                    }
                  }, 1200);
                } catch (autoplayErr) {
                  console.warn('Autoplay block:', autoplayErr);
                  setBlockedByBrowser(true);
                  setIsPlaying(false);
                }
              }, 500);
            },
            onStateChange: (event: any) => {
              // 1 = playing, 2 = paused, 0 = ended
              const playerState = event.data;
              if (playerState === 1) {
                // Keep states synchronized
                if (playerRef.current.getVolume() > 0) {
                  setIsPlaying(true);
                  setBlockedByBrowser(false);
                }
              } else if (playerState === 2) {
                setIsPlaying(false);
              } else if (playerState === 0) {
                // Loop back to 60 seconds
                event.target.seekTo(60);
                event.target.playVideo();
              }
            }
          }
        });
      } catch (initErr) {
        console.error('Failed initiating background YT Player instance:', initErr);
      }
    };

    // Robust Polling Script loader to ensure clean execution whenever API finishes loading
    let checkYT: any = null;

    if (window.YT && window.YT.Player) {
      onYTReady();
    } else {
      if (!window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = () => {
          onYTReady();
        };
      }

      // Check if tag is injected, if not inject it
      if (!document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode?.insertBefore(tag, firstScript);
      }

      // Fallback polling for maximum reliability on hot-reloaded dev sessions
      checkYT = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkYT);
          onYTReady();
        }
      }, 200);
    }

    return () => {
      if (checkYT) clearInterval(checkYT);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Swallow any cleanup release errors
        }
      }
    };
  }, []);

  return (
    <>
      {/* 
        PREMIUM SOUND FIX: Hidden standard-sized offscreen container.
        YouTube requires standard size (like 320x180) to be active. 
        Shrinking it to 0px or 1px triggers modern anti-clickjacking and pauses video automatically.
        Placing it outside visible borders keeps it fully operational and playing clean digital audio!
      */}
      <div
        id="yt-player-container"
        className="pointer-events-none fixed selection-none"
        style={{
          width: '320px',
          height: '180px',
          top: '-1000px',
          left: '-1000px',
          opacity: 0,
          zIndex: -9999,
        }}
      >
        <div id="wedding-invitation-yt-player" />
      </div>

      {/* 1. AUTOPLAY PROMPT OVERLAY BAR (Pulsing luxury design modal, grants audio permissions instantly) */}
      {blockedByBrowser && (
        <div id="autoplay-music-prompt-bar" className="fixed bottom-24 right-4 z-50 max-w-sm animate-bounce">
          <button
            onClick={() => {
              handleTogglePlayback();
              setBlockedByBrowser(false);
            }}
            className="flex items-center gap-3 bg-[#0d5945] border-2 border-gold-royal text-gold-bright font-display text-xs p-3.5 rounded-xl shadow-[0_4px_30px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <div className="bg-gold-royal text-emerald-deep p-1.5 rounded-full animate-spin">
              <Music className="w-4 h-4" />
            </div>
            <div className="text-left font-serif pr-1">
              <p className="font-bold text-gold-bright text-[11px] sm:text-xs">🔊 Tap to Play Royal Wedding Music</p>
              <p className="text-[10px] text-slate-350 mt-0.5">ঐতিহ্যবাহী বিয়ের মধুর সানাই সুর শুনতে ক্লিক করুন</p>
            </div>
            <Sparkles className="w-4 h-4 text-gold-bright animate-star-pulse" />
          </button>
        </div>
      )}

      {/* 2. FLOATING REAL-TIME MUSIC CONTROLLER IN BOTTOM-RIGHT CORNER */}
      <div 
        id="floating-audio-control"
        className="fixed bottom-6 right-6 z-50 bg-[#052b21]/95 border border-gold-royal/40 rounded-full py-2.5 px-4 shadow-[0_6px_35px_rgba(0,0,0,0.5)] flex items-center gap-3 md:gap-3.5 backdrop-blur-md hover:border-gold-royal transition-all duration-300 font-sans"
      >
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlayback}
          className="w-8 h-8 rounded-full bg-gold-royal text-emerald-deep flex items-center justify-center hover:brightness-110 transition cursor-pointer active:scale-90"
          title={isPlaying ? 'Pause Instrumental Music' : 'Play Instrumental Music'}
        >
          {isPlaying ? <Pause className="w-4 h-4 text-emerald-deep" /> : <Play className="w-4 h-4 fill-emerald-deep text-emerald-deep" />}
        </button>

        {/* Animated Sound Waves Visualizer SVG when actively playing */}
        <div className="flex items-end gap-1 h-5 w-7" title="Audio Visualizer">
          {visualizerBars.map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-sm bg-gradient-to-t from-gold-matte to-gold-bright transition-all duration-120"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        {/* Mute/Unmute toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-gold-matte hover:text-gold-bright transition cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Volume Level Slider Bar */}
        <div className="flex items-center gap-1.5 w-16 group/vol">
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
            className="w-full accent-gold-bright h-1 rounded bg-[#031410] border border-gold-royal/10 opacity-70 group-hover/vol:opacity-100 transition cursor-pointer"
            title="Adjust volume"
          />
        </div>
      </div>
    </>
  );
}
