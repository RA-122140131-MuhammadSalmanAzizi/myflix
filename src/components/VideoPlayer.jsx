import { useState, useEffect } from 'react';
import { getYouTubeEmbedUrl } from '../data/movies';

const VideoPlayer = ({ movie, isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !movie) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-fadeIn">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 flex items-center gap-2 text-white hover:text-gray-300 transition-colors group"
            >
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
                <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </button>

            {/* Back Button */}
            <button
                onClick={onClose}
                className="absolute top-4 left-4 z-50 flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
                <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </div>
                <span className="text-sm font-medium hidden md:block">Back to Browse</span>
            </button>

            {/* Movie Title */}
            <div className="absolute bottom-4 left-4 z-50">
                <h2 className="netflix-font text-2xl md:text-3xl text-white text-shadow tracking-wide">
                    {movie.title}
                </h2>
                <p className="text-gray-400 text-sm">{movie.year} • {movie.duration}</p>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-40">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
                        <p className="text-white text-lg">Loading {movie.title}...</p>
                    </div>
                </div>
            )}

            {/* Video Player */}
            <div className="w-full h-full">
                <iframe
                    src={getYouTubeEmbedUrl(movie.youtubeId, true)}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    title={movie.title}
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
