import { useState, useEffect } from 'react';
import { getYouTubeThumbnail } from '../data/movies';
import { useAuth } from '../context/AuthContext';

const MovieModal = ({ movie, isOpen, onClose, onPlay }) => {
    const [imageError, setImageError] = useState(false);
    const { isInMyList, toggleMyList } = useAuth();

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

    if (!isOpen || !movie) return null;

    const thumbnailUrl = movie.backdrop || getYouTubeThumbnail(movie.youtubeId);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-8 px-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="fixed inset-0 modal-backdrop animate-fadeIn" />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-4xl bg-[#181818] rounded-lg overflow-hidden shadow-2xl animate-scaleIn my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-[#181818] rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Video/Image Preview */}
                <div className="relative aspect-video">
                    <img
                        src={imageError ? getYouTubeThumbnail(movie.youtubeId, 'hqdefault') : thumbnailUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />

                    {/* Title & Actions Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <h2 className="netflix-font text-3xl md:text-5xl text-white text-shadow-lg mb-4 tracking-wide">
                            {movie.title}
                        </h2>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onPlay && onPlay(movie)}
                                className="flex items-center gap-2 px-6 py-2 bg-white hover:bg-gray-200 rounded text-black font-semibold transition-all duration-300"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Play</span>
                            </button>

                            <button
                                onClick={() => toggleMyList(movie)}
                                className={`w-10 h-10 border-2 rounded-full flex items-center justify-center transition-colors ${isInMyList(movie.id) ? 'border-white bg-white/20' : 'border-gray-400 hover:border-white'}`}
                            >
                                {isInMyList(movie.id) ? (
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                )}
                            </button>

                            <button className="w-10 h-10 border-2 border-gray-400 hover:border-white rounded-full flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-6 md:p-8">
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {/* Left Column - Main Info */}
                        <div className="md:col-span-2">
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                                <span className="text-green-400 font-bold">{movie.match}% Match</span>
                                <span className="text-gray-400">{movie.year}</span>
                                <span className="maturity-badge px-2 py-0.5">{movie.maturity}</span>
                                <span className="text-gray-400">{movie.duration}</span>
                                <span className="border border-gray-500 px-2 py-0.5 text-xs text-gray-300 rounded">HD</span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-200 text-base leading-relaxed mb-6">
                                {movie.description}
                            </p>
                        </div>

                        {/* Right Column - Details */}
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="text-gray-500">Cast: </span>
                                <span className="text-gray-300">{movie.cast?.join(', ')}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Director: </span>
                                <span className="text-gray-300">{movie.director}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Genres: </span>
                                <span className="text-gray-300">{movie.genre?.join(', ')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info Sections */}
                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <h3 className="text-white font-semibold mb-4">About {movie.title}</h3>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Director: </span>
                                <span className="text-white">{movie.director}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Cast: </span>
                                <span className="text-white">{movie.cast?.join(', ')}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Genres: </span>
                                <span className="text-white">{movie.genre?.join(', ')}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Maturity Rating: </span>
                                <span className="text-white">{movie.maturity}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieModal;
