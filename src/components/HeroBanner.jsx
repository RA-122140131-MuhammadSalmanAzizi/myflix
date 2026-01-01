import { useState, useEffect, useCallback, useRef } from 'react';
import { getYouTubeThumbnail } from '../data/movies';

const HeroBanner = ({ movie, onChangeMovie, onPlay, onInfo, forcePause }) => {
    const [isMuted, setIsMuted] = useState(false); // Default: sound ON (Unmuted)
    const [showVideo, setShowVideo] = useState(true);
    const [slideDirection, setSlideDirection] = useState('');
    const [videoKey, setVideoKey] = useState(0);
    const iframeRef = useRef(null);
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);

    // Force video reload on mount/movie change
    useEffect(() => {
        setVideoKey(prev => prev + 1);
        setIsMuted(false); // Reset to Unmuted on new movie
    }, [movie]);

    // Logic to rotate movie with animation
    const handleNextMovie = useCallback(() => {
        setSlideDirection('exit-right');

        setTimeout(() => {
            if (onChangeMovie) onChangeMovie();
            setSlideDirection('enter-left');

            setTimeout(() => {
                setSlideDirection('enter-center');
                setTimeout(() => setSlideDirection(''), 500);
            }, 50);
        }, 500);
    }, [onChangeMovie]);

    // Auto-change movie logic with 3-step animation
    useEffect(() => {
        if (!movie) return;
        if (forcePause) return; // Stop rotation if paused

        const changeTimer = setTimeout(handleNextMovie, 40000); // 40 seconds

        return () => clearTimeout(changeTimer);
    }, [movie, forcePause, handleNextMovie]);

    // Helper to send YouTube API commands
    const sendCommand = useCallback((command) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: command,
                args: []
            }), '*');
        }
    }, []);

    // Intersection Observer to track visibility state
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.2 } // 20% visible
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    // Master Play/Pause Control
    useEffect(() => {
        const shouldPlay = isVisible && !forcePause;

        if (shouldPlay) {
            // Play with delay
            setTimeout(() => {
                sendCommand('playVideo');
            }, 500);
        } else {
            // Pause immediately
            sendCommand('pauseVideo');
        }
    }, [isVisible, forcePause, sendCommand]);

    // Click handlers
    const handleToggleSound = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsMuted(prev => {
            const nextState = !prev;
            sendCommand(nextState ? 'mute' : 'unMute');
            return nextState;
        });
    }, [sendCommand]);

    const handlePlayClick = useCallback((e) => {
        e.stopPropagation();
        sendCommand('mute');
        sendCommand('pauseVideo');
        setIsMuted(true);
        if (onPlay) onPlay(movie);
    }, [movie, onPlay, sendCommand]);

    const handleInfoClick = useCallback((e) => {
        e.stopPropagation();
        sendCommand('mute');
        sendCommand('pauseVideo');
        setIsMuted(true);
        if (onInfo) onInfo(movie);
    }, [movie, onInfo, sendCommand]);

    // Animation classes
    const getAnimationClasses = (direction) => {
        switch (direction) {
            case 'exit-right':
                return 'translate-x-full opacity-0 transition-all duration-500 ease-out';
            case 'enter-left':
                return '-translate-x-full opacity-0 transition-none';
            case 'enter-center':
                return 'translate-x-0 opacity-100 transition-all duration-500 ease-out';
            default:
                return 'translate-x-0 opacity-100 transition-all duration-500 ease-out';
        }
    };

    if (!movie) return null;

    // CHANGED: Default mute=0 (Unmuted).
    // Note: Browser might block audio autoplay if no interaction.
    const embedUrl = `https://www.youtube.com/embed/${movie.youtubeId}?autoplay=1&mute=0&start=60&loop=1&playlist=${movie.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`;

    return (
        <div
            ref={containerRef}
            className="relative h-[70vh] md:h-[85vh] lg:h-screen w-full overflow-hidden group"
        >
            <div className={`absolute inset-0 ${getAnimationClasses(slideDirection)}`}>
                {showVideo ? (
                    <div className="w-full h-full relative overflow-hidden">
                        <iframe
                            ref={iframeRef}
                            key={`video-${movie.id}-${videoKey}`}
                            src={embedUrl}
                            className="absolute top-1/2 left-1/2 pointer-events-none"
                            style={{
                                width: '200vw',
                                height: '200vh',
                                transform: 'translate(-50%, -50%)',
                                border: 'none'
                            }}
                            allow="autoplay; encrypted-media" // Changed allow attribute
                            allowFullScreen
                            title={movie.title}
                        />
                    </div>
                ) : (
                    <img
                        src={movie.backdrop || getYouTubeThumbnail(movie.youtubeId)}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                )}

                <div className="absolute inset-0 hero-gradient pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>

            <div className={`absolute inset-0 flex items-center pointer-events-none ${getAnimationClasses(slideDirection)}`}>
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
                    <div className="max-w-xl lg:max-w-2xl pointer-events-auto">
                        <div className="mb-4 md:mb-6">
                            {movie.isNew && (
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-[#E50914] px-2 py-0.5 text-xs font-bold rounded">N</span>
                                    <span className="text-gray-300 text-sm font-medium tracking-widest uppercase">
                                        New on MyFlix
                                    </span>
                                </div>
                            )}
                            <h1 className="netflix-font text-4xl md:text-5xl lg:text-7xl text-white text-shadow-lg tracking-wide mb-2">
                                {movie.title}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 mb-4 text-sm md:text-base">
                            <span className="text-green-400 font-bold">{movie.match}% Match</span>
                            <span className="text-gray-400">{movie.year}</span>
                            <span className="maturity-badge px-2 py-0.5 text-sm">{movie.maturity}</span>
                            <span className="text-gray-400">{movie.duration}</span>
                            <span className="border border-gray-500 px-2 py-0.5 text-xs text-gray-300 rounded">HD</span>
                        </div>

                        <p className="text-gray-200 text-sm md:text-base lg:text-lg leading-relaxed mb-6 line-clamp-3 md:line-clamp-4 text-shadow">
                            {movie.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            {movie.genre?.map((g, i) => (
                                <span key={g} className="flex items-center text-gray-300 text-sm">
                                    {g}
                                    {i < movie.genre.length - 1 && <span className="ml-2 w-1 h-1 bg-gray-500 rounded-full" />}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 md:gap-4">
                            <button
                                onClick={handlePlayClick}
                                className="flex items-center gap-2 px-5 md:px-8 py-2 md:py-3 rounded text-black bg-white hover:bg-gray-200 font-semibold text-base md:text-lg transition-all duration-300"
                            >
                                <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Play</span>
                            </button>

                            <button
                                onClick={handleInfoClick}
                                className="btn-secondary flex items-center gap-2 px-5 md:px-8 py-2 md:py-3 rounded text-white font-semibold text-base md:text-lg"
                            >
                                <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>More Info</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Next Arrow (Right Side Overlay) - Visible on Hover */}
            <div
                className="absolute right-0 top-0 bottom-0 w-16 md:w-20 flex items-center justify-center z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer bg-gradient-to-l from-black/50 to-transparent"
                onClick={(e) => {
                    e.stopPropagation();
                    handleNextMovie();
                }}
            >
                <button className="text-white transform hover:scale-125 transition-transform duration-200">
                    <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Sound Control (Bottom Right) */}
            <div className="absolute bottom-24 md:bottom-32 right-4 md:right-12 flex items-center gap-3 z-50">
                <button
                    type="button"
                    onClick={handleToggleSound}
                    className="w-10 h-10 md:w-12 md:h-12 border border-white/40 rounded-full flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-all duration-200 bg-black/30 cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    style={{ pointerEvents: 'auto' }}
                >
                    {isMuted ? (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    )}
                </button>

                <div className="maturity-badge px-3 py-1 text-sm font-medium">
                    {movie.maturity}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-[#141414] to-transparent pointer-events-none" />
        </div>
    );
};

export default HeroBanner;
