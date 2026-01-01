import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { movies } from '../data/movies';

// Profile Icon Component
const ProfileIcon = ({ type, className = "" }) => {
    const icons = {
        movie: (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
            </svg>
        ),
        user: (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
        ),
        kid: (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-6c.78 2.34 2.72 4 5 4s4.22-1.66 5-4H7z" />
            </svg>
        ),
        add: (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
        )
    };

    return icons[type] || icons.movie;
};

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { currentProfile, clearProfile, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-open notifications after 3 seconds - ONLY on first visit per session
    useEffect(() => {
        const hasSeenNotification = sessionStorage.getItem('myflix_notif_shown');

        if (!hasSeenNotification && location.pathname.startsWith('/browse')) {
            const timer = setTimeout(() => {
                setShowNotifications(true);
                sessionStorage.setItem('myflix_notif_shown', 'true');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []); // Only run once on mount

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                if (searchQuery === '') {
                    setShowSearch(false);
                }
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchQuery]);

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = movies.filter(movie =>
            movie.title.toLowerCase().includes(query) ||
            movie.genre.some(g => g.toLowerCase().includes(query)) ||
            movie.director?.toLowerCase().includes(query) ||
            movie.cast?.some(c => c.toLowerCase().includes(query))
        );
        setSearchResults(results.slice(0, 5));
    }, [searchQuery]);

    const handleSearchSelect = (movie) => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearch(false);
        // Navigate to movies page with the movie
        navigate('/browse/movies');
    };

    const navLinks = [
        { path: '/browse', label: 'Home' },
        { path: '/browse/movies', label: 'Movies' },
        { path: '/browse/series', label: 'TV Series' },
        { path: '/browse/my-list', label: 'My List' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-[#141414]/95 backdrop-blur-sm shadow-xl'
                : 'bg-gradient-to-b from-black/80 to-transparent'
                }`}
        >
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Left Section - Logo & Nav Links */}
                    <div className="flex items-center gap-6 md:gap-10">
                        <Link to="/browse" className="flex items-center">
                            <span className="netflix-font text-2xl md:text-3xl text-[#E50914] font-bold tracking-wider">
                                MYFLIX
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-medium transition-all duration-300 hover:text-white ${location.pathname === link.path
                                        ? 'text-white font-semibold'
                                        : 'text-gray-300'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <button className="md:hidden text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Right Section - Search & Profile */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Search */}
                        <div className="relative" ref={searchRef}>
                            <div
                                className={`flex items-center transition-all duration-300 ${showSearch
                                    ? 'bg-black/90 border border-white/30 px-3 py-1.5 rounded'
                                    : ''
                                    }`}
                            >
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="text-white hover:text-gray-300 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                                {showSearch && (
                                    <input
                                        type="text"
                                        placeholder="Titles, genres, people..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="ml-2 bg-transparent text-white text-sm w-40 md:w-56 outline-none placeholder-gray-400"
                                        autoFocus
                                    />
                                )}
                            </div>

                            {/* Search Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50 min-w-[300px]">
                                    {searchResults.map((movie) => (
                                        <button
                                            key={movie.id}
                                            onClick={() => handleSearchSelect(movie)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                                        >
                                            <img
                                                src={movie.thumbnail}
                                                alt={movie.title}
                                                className="w-12 h-16 object-cover rounded"
                                            />
                                            <div>
                                                <p className="text-white font-medium text-sm">{movie.title}</p>
                                                <p className="text-gray-400 text-xs">{movie.year} • {movie.genre.slice(0, 2).join(', ')}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="hidden md:block text-white hover:text-gray-300 transition-colors relative"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E50914] rounded-full text-[10px] flex items-center justify-center">
                                    1
                                </span>
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-black/95 border border-white/10 rounded-md shadow-xl animate-fadeInDown overflow-hidden">
                                    <div className="p-4 border-b border-white/10">
                                        <h3 className="text-white font-semibold">Notifications</h3>
                                    </div>

                                    {/* Support Developer Card */}
                                    <div className="p-4">
                                        <div className="bg-gradient-to-br from-[#E50914]/20 to-transparent rounded-lg p-4 border border-[#E50914]/30">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#E50914] flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-medium text-sm mb-1">Support Developer</h4>
                                                    <p className="text-gray-400 text-xs mb-3">
                                                        Myflix web streaming bebas iklan judol, boleh kali support developer seikhlasnya ya!
                                                    </p>

                                                    {/* QR Code */}
                                                    <div className="bg-white rounded-lg p-2 mb-3 w-fit">
                                                        <img
                                                            src={`${import.meta.env.BASE_URL}qrdonet.jpeg`}
                                                            alt="QR Code Donasi"
                                                            className="w-32 h-32 object-contain"
                                                        />
                                                    </div>

                                                    <a
                                                        href="https://link.dana.id/minta?full_url=https://qr.dana.id/v1/281012012024100543167079"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 bg-[#118EEA] hover:bg-[#0D7ACC] text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                                                        </svg>
                                                        Donate via DANA
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 border-t border-white/10 text-center">
                                        <p className="text-gray-500 text-xs">Berapapun makasih banyak!</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowProfileMenu(!showProfileMenu);
                                    setShowNotifications(false);
                                }}
                                className="flex items-center gap-2 group"
                            >
                                <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${currentProfile?.color || 'from-red-600 to-red-800'} flex items-center justify-center`}>
                                    <ProfileIcon type={currentProfile?.iconType || 'movie'} className="w-5 h-5 text-white" />
                                </div>
                                <svg
                                    className={`w-4 h-4 text-white transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-3 w-56 bg-black/95 border border-white/10 rounded-md shadow-xl animate-fadeInDown">
                                    <div className="p-3 border-b border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${currentProfile?.color || 'from-red-600 to-red-800'} flex items-center justify-center`}>
                                                <ProfileIcon type={currentProfile?.iconType || 'movie'} className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{currentProfile?.name || 'Profile'}</p>
                                                <p className="text-gray-400 text-sm">Premium Member</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                clearProfile();
                                                setShowProfileMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 transition-colors text-sm"
                                        >
                                            Switch Profiles
                                        </button>
                                        <Link
                                            to="/browse/my-list"
                                            onClick={() => setShowProfileMenu(false)}
                                            className="block px-4 py-2 text-gray-300 hover:bg-white/10 transition-colors text-sm"
                                        >
                                            My List
                                        </Link>
                                        <button
                                            className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 transition-colors text-sm"
                                        >
                                            Account
                                        </button>
                                    </div>
                                    <div className="border-t border-white/10 py-2">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setShowProfileMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 transition-colors text-sm"
                                        >
                                            Sign out of MyFlix
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
