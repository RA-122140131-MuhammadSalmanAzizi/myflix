import { useRef, useState } from 'react';
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies, onPlay, onInfo, showRank = false }) => {
    const rowRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = (direction) => {
        if (rowRef.current) {
            const scrollAmount = rowRef.current.clientWidth * 0.8;
            const newScrollLeft = direction === 'left'
                ? rowRef.current.scrollLeft - scrollAmount
                : rowRef.current.scrollLeft + scrollAmount;

            rowRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const handleScrollUpdate = () => {
        if (rowRef.current) {
            setShowLeftArrow(rowRef.current.scrollLeft > 0);
            setShowRightArrow(
                rowRef.current.scrollLeft <
                rowRef.current.scrollWidth - rowRef.current.clientWidth - 10
            );
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <div className="relative group mb-8 md:mb-12">
            {/* Row Title */}
            <h2 className="text-white text-lg md:text-xl lg:text-2xl font-semibold mb-3 md:mb-4 px-4 sm:px-6 lg:px-12 flex items-center gap-2">
                {title}
                <span className="text-[#54b9c5] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    Explore All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </h2>

            {/* Row Container */}
            <div className="relative">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={() => handleScroll('left')}
                        className="absolute left-0 top-0 bottom-0 w-12 md:w-16 bg-black/60 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {/* Movies Container */}
                <div
                    ref={rowRef}
                    onScroll={handleScrollUpdate}
                    className="flex gap-2 md:gap-3 overflow-x-auto row-container px-4 sm:px-6 lg:px-12 pb-4"
                >
                    {movies.map((movie, index) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            index={index}
                            onPlay={onPlay}
                            onInfo={onInfo}
                            showRank={showRank}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        onClick={() => handleScroll('right')}
                        className="absolute right-0 top-0 bottom-0 w-12 md:w-16 bg-black/60 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MovieRow;
