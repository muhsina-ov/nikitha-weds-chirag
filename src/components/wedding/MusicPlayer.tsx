import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { invitation } from "@/config/invitation";
import { useOpened } from "./OpenGate";

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: any }) => void;
            onStateChange?: (event: { data: number; target: any }) => void;
            onError?: (event: any) => void;
          };
        }
      ) => any;
      PlayerState?: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function MusicPlayer() {
  const opened = useOpened();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<any>(null);
  const containerId = "yt-bg-music-player";
  const youtubeId = invitation.music?.youtubeId ?? "YK-TkctENzQ";

  // Attempt local audio playback first (instant, no ads, reliable looping on mobile)
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Fallback to YouTube player if HTML5 audio fails
          if (playerRef.current?.playVideo) {
            playerRef.current.playVideo();
            setIsPlaying(true);
          }
        });
    } else if (playerRef.current?.playVideo) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (playerRef.current?.pauseVideo) {
      playerRef.current.pauseVideo();
    }
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  // Play as soon as user taps "Open the invitation"
  useEffect(() => {
    if (opened) {
      playAudio();
    }
  }, [opened]);

  // Load YouTube IFrame API as fallback / enhancement
  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(containerId, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: youtubeId,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event: { data: number; target: any }) => {
            if (!isMounted) return;
            if (event.data === 0) {
              // ENDED -> loop
              event.target.playVideo();
              setIsPlaying(true);
            } else if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };

      if (!document.getElementById("youtube-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [youtubeId]);

  return (
    <>
      {/* Native HTML5 Audio for instant offline/mobile playback */}
      <audio
        ref={audioRef}
        src="/audio/chanakya_sitar.mp3"
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Hidden YouTube Iframe Player */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-96 -right-96 h-1 w-1 opacity-0 overflow-hidden"
      >
        <div id={containerId} />
      </div>

      {/* Floating Gold/Pine Audio Controller — only visible when opened */}
      {opened && (
        <aside aria-label="Background music controls" className="fixed top-5 right-5 z-40 sm:top-6 sm:right-6">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause background music" : "Play background music"}
            className="group relative flex items-center gap-2 rounded-full border border-gold/60 bg-parchment/90 px-3.5 py-2 text-pine shadow-lg backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-parchment active:scale-95"
          >
            {isPlaying ? (
              <>
                <div className="flex h-3.5 items-end gap-0.5" aria-hidden="true">
                  <span className="w-0.5 bg-gold animate-[pulse_0.8s_ease-in-out_infinite] h-3" />
                  <span className="w-0.5 bg-gold animate-[pulse_1.1s_ease-in-out_infinite_0.2s] h-2" />
                  <span className="w-0.5 bg-gold animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-3.5" />
                </div>
                <Volume2 className="size-4 text-gold transition-transform group-hover:scale-110" />
              </>
            ) : (
              <>
                <Music className="size-3.5 text-ink/40" aria-hidden="true" />
                <VolumeX className="size-4 text-ink/60 transition-transform group-hover:scale-110" />
              </>
            )}
            <span className="hidden font-display text-[0.65rem] tracking-[0.2em] text-pine uppercase sm:inline-block">
              {isPlaying ? "Music" : "Muted"}
            </span>
          </button>
        </aside>
      )}
    </>
  );
}
