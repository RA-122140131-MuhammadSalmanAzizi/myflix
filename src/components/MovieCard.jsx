import { useState } from 'react';
import { getYouTubeThumbnail } from '../data/movies';
import { useAuth } from '../context/AuthContext';

const MovieCard = ({ movie, index, onPlay, onInfo, showRank = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { isInMyList, toggleMyList } = useAuth();

    const thumbnailUrl = movie.thumbnail || getYouTubeThumbnail(movie.youtubeId);
    const fallbackUrl = getYouTubeThumbnail(movie.youtubeId, 'hqdefault');

    if (movie.isComingSoon) {
        return (
            <div
                className="relative flex-shrink-0 w-40 sm:w-48 md:w-56 aspect-[2/3] rounded-md overflow-hidden group cursor-pointer movie-card"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Coming Soon Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 flex flex-col items-center justify-center p-4">
                    <div className="mb-3 animate-float">
                        <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                    </div>
                    <h4 className="text-white font-semibold text-center text-sm mb-1">{movie.title}</h4>
                    <p className="text-gray-400 text-xs">{movie.year}</p>
                    <span className="mt-3 px-3 py-1 coming-soon-badge rounded-full text-xs text-white font-medium">
                        Coming Soon
                    </span>
                    <p className="text-gray-400 text-xs mt-2 text-center">{movie.releaseDate}</p>
                </div>

                {/* Hover Overlay */}
                {isHovered && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-fadeIn">
                        <div className="text-center p-4">
                            <div className="flex items-center justify-center gap-2 text-white text-sm font-medium mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span>Notify Me</span>
                            </div>
                            <p className="text-gray-300 text-xs">{movie.genre?.join(' • ')}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className="relative flex-shrink-0 w-40 sm:w-48 md:w-56 rounded-md overflow-hidden group cursor-pointer movie-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onInfo && onInfo(movie)}
        >
            {/* Rank Number (for Top 10) */}
            {showRank && (
                <div className="absolute -left-2 top-0 bottom-0 flex items-center z-10">
                    <span className="top-number text-6xl md:text-8xl opacity-80">
                        {index + 1}
                    </span>
                </div>
            )}

            {/* Thumbnail */}
            <div className={`aspect-[2/3] ${showRank ? 'ml-8' : ''}`}>
                <img
                    src={imageError ? fallbackUrl : thumbnailUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* New Badge */}
                {movie.isNew && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#E50914] text-white text-[10px] font-bold rounded">
                        NEW
                    </span>
                )}

                {/* Match & Maturity on Hover */}
                {isHovered && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 animate-fadeInUp">
                        <h4 className="text-white font-semibold text-sm mb-1 text-shadow">{movie.title}</h4>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-green-400 font-bold">{movie.match}% Match</span>
                            <span className="maturity-badge px-1.5 py-0.5 text-[10px]">{movie.maturity}</span>
                        </div>
                        <p className="text-gray-300 text-xs mt-1">{movie.genre?.slice(0, 2).join(' • ')}</p>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPlay && onPlay(movie);
                                }}
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMyList(movie);
                                }}
                                className={`w-8 h-8 border-2 rounded-full flex items-center justify-center transition-colors ${isInMyList(movie.id) ? 'border-white bg-white/20' : 'border-gray-400 hover:border-white'}`}
                            >
                                {isInMyList(movie.id) ? (
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                )}
                            </button>
                            <button className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieCard;
