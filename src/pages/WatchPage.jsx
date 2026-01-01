import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movies } from '../data/movies';

const WatchPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true); // Auto-play
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(100);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [startOverlay, setStartOverlay] = useState(true); // Initial black overlay

    // Feedback state for seek actions
    const [seekFeedback, setSeekFeedback] = useState(null); // { type: 'forward' | 'backward', id: number }

    const iframeRef = useRef(null);
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const progressIntervalRef = useRef(null);
    const feedbackTimeoutRef = useRef(null);
    const overlayTimerRef = useRef(null);

    // Find movie data
    useEffect(() => {
        const foundMovie = movies.find(m => m.id === parseInt(id));
        if (foundMovie) {
            setMovie(foundMovie);
        } else {
            navigate('/browse'); // Redirect if not found
        }
    }, [id, navigate]);

    // Setup YouTube Iframe API
    useEffect(() => {
        if (!movie) return;

        // Function to create script if not exists
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            // YT API ready
        };
    }, [movie]);



    // Back button
    const handleBack = () => {
        navigate(-1);
    };

    // --- Using full YT.Player API ---
    const playerRef = useRef(null);

    useEffect(() => {
        if (!movie) return;

        let player;

        const initPlayer = () => {
            player = new window.YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: movie.youtubeId,
                playerVars: {
                    'autoplay': 1,
                    'controls': 0, // Hide native controls
                    'disablekb': 1, // Disable keyboard controls
                    'fs': 0, // Hide fullscreen button
                    'modestbranding': 1,
                    'rel': 0,
                    'showinfo': 0,
                    'iv_load_policy': 3 // Hide annotations
                },
                events: {
                    'onReady': (event) => {
                        playerRef.current = event.target;
                        setDuration(event.target.getDuration());
                        event.target.playVideo();
                    },
                    'onStateChange': (event) => {
                        // 1 = Playing, 2 = Paused, 3 = Buffering
                        const playerState = event.data;
                        setIsPlaying(playerState === 1);

                        if (playerState === 1) {
                            startProgressTimer();

                            // Trigger overlay removal 4s AFTER video actually starts playing
                            // This handles buffering delays correctly
                            if (!overlayTimerRef.current) {
                                overlayTimerRef.current = setTimeout(() => {
                                    setStartOverlay(false);
                                }, 3500); // 3.5s after play start (adjusted slightly for feel)
                            }
                        } else {
                            stopProgressTimer();
                        }
                    }
                }
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (player) {
                player.destroy();
            }
            stopProgressTimer();
        };
    }, [movie]);

    const startProgressTimer = () => {
        stopProgressTimer();
        progressIntervalRef.current = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                setCurrentTime(playerRef.current.getCurrentTime());
            }
        }, 1000);
    };

    const stopProgressTimer = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
    };

    // Interaction Handlers
    const togglePlay = () => {
        if (isPlaying) {
            playerRef.current?.pauseVideo();
        } else {
            playerRef.current?.playVideo();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        playerRef.current?.setVolume(newVolume);
        if (newVolume === 0) {
            setIsMuted(true);
            playerRef.current?.mute();
        } else {
            setIsMuted(false);
            playerRef.current?.unMute();
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            playerRef.current?.unMute();
            playerRef.current?.setVolume(volume || 100);
            setIsMuted(false);
        } else {
            playerRef.current?.mute();
            setIsMuted(true);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        playerRef.current?.seekTo(time, true);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Show feedback animation
    const triggerFeedback = (type) => {
        setSeekFeedback({ type, id: Date.now() });
        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = setTimeout(() => {
            setSeekFeedback(null);
        }, 600); // Animation duration
    };

    const handleRewind = () => {
        const newTime = Math.max(0, currentTime - 5);
        setCurrentTime(newTime);
        playerRef.current?.seekTo(newTime, true);
        triggerFeedback('backward');
    };

    const handleForward = () => {
        const newTime = Math.min(duration, currentTime + 10);
        setCurrentTime(newTime);
        playerRef.current?.seekTo(newTime, true);
        triggerFeedback('forward');
    };


    // Keep track of playing state in a ref for the event listener closure
    const isPlayingRef = useRef(isPlaying);
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // Auto-hide controls logic
    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);

            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }

            controlsTimeoutRef.current = setTimeout(() => {
                // Check the REF, not the state directly, to get current value inside timeout
                if (isPlayingRef.current) {
                    setShowControls(false);
                }
            }, 3000); // Hide after 3s of inactivity
        };

        const container = containerRef.current;
        if (container) {
            // Trigger once on mount to start timer
            handleMouseMove();
            container.addEventListener('mousemove', handleMouseMove);
            // Also handle touch for mobile
            container.addEventListener('touchstart', handleMouseMove);
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('touchstart', handleMouseMove);
            }
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, []); // Empty dependency array, event listener attached ONCE

    // Format time helper
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!movie) return null;

    return (
        <div ref={containerRef} className={`w-full h-screen bg-black overflow-hidden relative group ${!showControls ? 'cursor-none' : ''}`}>
            <style>{`
                .volume-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 0;
                    height: 0;
                    opacity: 0;
                    transition: all 0.2s ease;
                }
                .volume-container:hover .volume-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background: white;
                    border-radius: 50%;
                    opacity: 1;
                    cursor: pointer;
                    margin-top: -4px;
                }
                .volume-container:hover .volume-slider::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    background: white;
                    border: none;
                    border-radius: 50%;
                    opacity: 1;
                    cursor: pointer;
                }
                @keyframes fadeZoom {
                    0% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(1.5); }
                }
                .seek-feedback {
                    animation: fadeZoom 0.5s ease-out forwards;
                }
            `}</style>

            {/* YouTube Player Container */}
            <div id="youtube-player" className="w-full h-full pointer-events-none" />

            {/* --- INITIAL BLACK OVERLAYS to hide YT controls --- */}
            <div className={`absolute top-0 left-0 right-0 h-28 bg-black z-30 transition-opacity duration-1000 ${startOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
            <div className={`absolute bottom-0 left-0 right-0 h-24 bg-black z-30 transition-opacity duration-1000 ${startOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
            {/* -------------------------------------------------- */}

            {/* Blur Overlay when Paused OR Near End */}
            {(!isPlaying || (duration > 0 && duration - currentTime < 25)) && (
                <div className="absolute inset-0 z-[15] backdrop-blur-xl bg-black/50 transition-all duration-500" />
            )}

            {/* Click Layer */}
            <div
                className="absolute inset-0 z-10"
                onClick={togglePlay}
            />

            {/* Seek Feedback Animation - SEPARATED LEFT/RIGHT */}
            {seekFeedback && seekFeedback.type === 'backward' && (
                <div key={seekFeedback.id} className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <div className="seek-feedback flex flex-col items-center justify-center">
                        <svg className="w-20 h-20 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" /></svg>
                        <span className="text-white text-2xl font-bold drop-shadow-lg mt-2">-5s</span>
                    </div>
                </div>
            )}

            {seekFeedback && seekFeedback.type === 'forward' && (
                <div key={seekFeedback.id} className="absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 pointer-events-none">
                    <div className="seek-feedback flex flex-col items-center justify-center">
                        <svg className="w-20 h-20 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" /></svg>
                        <span className="text-white text-2xl font-bold drop-shadow-lg mt-2">+10s</span>
                    </div>
                </div>
            )}

            {/* Back Button (Always accessible) */}
            <button
                onClick={handleBack}
                className={`absolute top-6 left-6 z-50 text-white hover:bg-white/20 p-2 rounded-full transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            {/* Big Center Play Button (Triangle Only) - CENTERED */}
            {!isPlaying && (
                <div
                    onClick={togglePlay}
                    className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
                >
                    <svg className="w-28 h-28 text-white drop-shadow-xl hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            )}

            {/* Controls Overlay */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-8 pb-8 pt-20 z-50 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
            >
                {/* Progress Bar */}
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-gray-300 text-sm font-medium">{formatTime(currentTime)}</span>
                    <div className="relative flex-1 h-1.5 bg-gray-600 rounded-full group/slider cursor-pointer">
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div
                            className="absolute top-0 left-0 h-full bg-[#E50914] rounded-full"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                        <div
                            className="absolute top-1/2 -mt-2 h-4 w-4 bg-[#E50914] rounded-full shadow-lg transform scale-0 group-hover/slider:scale-100 transition-transform"
                            style={{ left: `${(currentTime / duration) * 100}%`, marginLeft: '-6px' }}
                        />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{formatTime(duration)}</span>
                </div>

                {/* Bottom Controls Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {/* Play/Pause */}
                        <button onClick={togglePlay} className="text-white hover:text-[#E50914] transition-colors">
                            {isPlaying ? (
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                            ) : (
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </button>

                        {/* Back 5s */}
                        <button onClick={handleRewind} className="text-white hover:text-gray-300 transition-colors group relative">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" /></svg>
                        </button>

                        {/* Forward 10s */}
                        <button onClick={handleForward} className="text-white hover:text-gray-300 transition-colors group relative">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" /></svg>
                        </button>

                        {/* Volume */}
                        <div className="flex items-center gap-2 volume-container group/vol">
                            <button onClick={toggleMute} className="text-white hover:text-gray-300">
                                {isMuted || volume === 0 ? (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                                ) : (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="volume-slider w-0 group-hover/vol:w-28 transition-all duration-300 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                            />
                        </div>

                        {/* Title */}
                        <span className="text-white font-medium text-lg ml-4 truncate max-w-md">{movie.title}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Fullscreen */}
                        <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition-colors">
                            {isFullscreen ? (
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                            ) : (
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchPage;
