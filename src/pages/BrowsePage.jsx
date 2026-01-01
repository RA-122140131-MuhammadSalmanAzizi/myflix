import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import Footer from '../components/Footer';
import { movies, comingSoonMovies, rowCategories } from '../data/movies';

// Function to shuffle array
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const BrowsePage = () => {
    const navigate = useNavigate();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [featuredIndex, setFeaturedIndex] = useState(0);

    // Get a shuffled list of movies for the hero rotation (use all movies that have videos)
    // Memoize this so it doesn't reshuffle on every render
    const heroMovies = useMemo(() => {
        // Filter movies that are suitable for hero (e.g., have youtubeId)
        const candidates = movies.filter(m => m.youtubeId);
        return shuffleArray(candidates);
    }, []);

    const featuredMovie = heroMovies[featuredIndex];

    // Pre-calculate next movie for seamless transition
    const nextFeaturedMovie = heroMovies[(featuredIndex + 1) % heroMovies.length];

    // Change to next featured movie logic
    const handleChangeMovie = useCallback(() => {
        setFeaturedIndex(prev => (prev + 1) % heroMovies.length);
    }, [heroMovies.length]);

    const handlePlay = (movie) => {
        setIsModalOpen(false);
        navigate(`/watch/${movie.id}`);
    };

    const handleInfo = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };



    // Get movies for each row category
    const getMoviesForCategory = (category) => {
        if (category.isComingSoon) {
            return comingSoonMovies;
        }
        return movies.filter(category.filter);
    };

    return (
        <div className="min-h-screen bg-[#141414]">
            <Navbar />

            {/* Hero Banner with seamless transition props */}
            <HeroBanner
                movie={featuredMovie}
                onPlay={handlePlay}
                onInfo={handleInfo}
                onChangeMovie={handleChangeMovie}
                forcePause={isModalOpen}
            />

            {/* Movie Rows */}
            <div className="relative z-20 -mt-16 md:-mt-24 lg:-mt-32 pb-8">
                {/* Top 10 Row - Special styling */}
                <MovieRow
                    title="Top 10 in Indonesia Today"
                    movies={movies.slice(0, 6)}
                    onPlay={handlePlay}
                    onInfo={handleInfo}
                    showRank={true}
                />

                {/* Regular Rows */}
                {rowCategories.map((category) => {
                    const categoryMovies = getMoviesForCategory(category);
                    if (categoryMovies.length === 0) return null;

                    return (
                        <MovieRow
                            key={category.id}
                            title={category.title}
                            movies={categoryMovies}
                            onPlay={handlePlay}
                            onInfo={handleInfo}
                        />
                    );
                })}
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


        </div>
    );
};

export default BrowsePage;
