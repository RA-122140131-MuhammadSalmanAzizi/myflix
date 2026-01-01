import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SeriesPage = () => {
    return (
        <div className="min-h-screen bg-[#141414] pt-20">
            <Navbar />

            {/* Page Header */}
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
                <h1 className="text-white text-3xl md:text-4xl font-bold mb-8">TV Series</h1>

                {/* Coming Soon Placeholder */}
                <div className="flex flex-col items-center justify-center py-32">
                    {/* TV Icon */}
                    <div className="w-32 h-32 mb-8 text-gray-600">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <h2 className="text-white text-2xl md:text-3xl font-semibold mb-4">Coming Soon</h2>
                    <p className="text-gray-400 text-lg text-center max-w-md mb-8">
                        We're working on bringing you the best TV series collection. Stay tuned!
                    </p>

                    {/* Decorative Progress Bar */}
                    <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-gradient-to-r from-[#E50914] to-[#B20710] rounded-full animate-pulse" />
                    </div>

                    <p className="text-gray-500 text-sm mt-4">Content will be available soon</p>
                </div>

                {/* Placeholder Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 opacity-30">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="aspect-[2/3] bg-gray-800 rounded-md animate-pulse"
                        />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default SeriesPage;
