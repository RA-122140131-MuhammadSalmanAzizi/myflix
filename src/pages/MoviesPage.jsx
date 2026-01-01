import { useState } from 'react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import VideoPlayer from '../components/VideoPlayer';
import Footer from '../components/Footer';
import { movies, categories } from '../data/movies';

const MoviesPage = () => {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [playingMovie, setPlayingMovie] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handlePlay = (movie) => {
        setPlayingMovie(movie);
        setIsPlayerOpen(true);
        setIsModalOpen(false);
    };

    const handleInfo = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    const handleClosePlayer = () => {
        setIsPlayerOpen(false);
        setPlayingMovie(null);
    };

    // Filter movies by category
    const filteredMovies = selectedCategory === 'all'
        ? movies
        : movies.filter(m => m.genre.some(g => g.toLowerCase().includes(selectedCategory.toLowerCase())));

    return (
        <div className="min-h-screen bg-[#141414] pt-20">
            <Navbar />

            {/* Page Header */}
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <h1 className="text-white text-3xl md:text-4xl font-bold">Movies</h1>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.id
                                        ? 'bg-white text-black'
                                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {filteredMovies.map((movie, index) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            index={index}
                            onPlay={handlePlay}
                            onInfo={handleInfo}
                        />
                    ))}
                </div>

                {filteredMovies.length === 0 && (
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                        <p className="text-gray-400 text-lg">No movies found in this category</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />

            {/* Movie Detail Modal */}
            <MovieModal
                movie={selectedMovie}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onPlay={handlePlay}
            />

            {/* Video Player */}
            <VideoPlayer
                movie={playingMovie}
                isOpen={isPlayerOpen}
                onClose={handleClosePlayer}
            />
        </div>
    );
};

export default MoviesPage;
