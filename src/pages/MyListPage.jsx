import { useState } from 'react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import VideoPlayer from '../components/VideoPlayer';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const MyListPage = () => {
    const { myList } = useAuth();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [playingMovie, setPlayingMovie] = useState(null);

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

    return (
        <div className="min-h-screen bg-[#141414] pt-20">
            <Navbar />

            {/* Page Header */}
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-white text-3xl md:text-4xl font-bold">My List</h1>
                    {myList.length > 0 && (
                        <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-sm">
                            {myList.length} {myList.length === 1 ? 'title' : 'titles'}
                        </span>
                    )}
                </div>

                {/* My List Grid */}
                {myList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {myList.map((movie, index) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                index={index}
                                onPlay={handlePlay}
                                onInfo={handleInfo}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-32">
                        {/* Plus Icon */}
                        <div className="w-24 h-24 mb-6 rounded-full border-2 border-gray-600 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>

                        <h2 className="text-white text-2xl md:text-3xl font-semibold mb-4">Your list is empty</h2>
                        <p className="text-gray-400 text-lg text-center max-w-md mb-8">
                            Add movies and TV shows to your list by clicking the + icon on any title.
                        </p>

                        {/* Browse Button */}
                        <a
                            href="/browse"
                            className="btn-primary px-8 py-3 rounded text-white font-semibold text-lg"
                        >
                            Browse Content
                        </a>
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

export default MyListPage;
