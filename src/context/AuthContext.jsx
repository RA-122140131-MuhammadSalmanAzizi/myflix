import { createContext, useContext, useState, useEffect } from 'react';
import { profiles } from '../data/movies';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [myList, setMyList] = useState([]); // Favorite movies

    useEffect(() => {
        // Check for existing session
        const savedAuth = localStorage.getItem('myflix_auth');
        const savedMyList = localStorage.getItem('myflix_mylist');

        if (savedAuth === 'true') {
            setIsAuthenticated(true);
            // Don't load saved profile - force user to select profile on reload
            localStorage.removeItem('myflix_profile');

            if (savedMyList) {
                setMyList(JSON.parse(savedMyList));
            }
        }
        setIsLoading(false);
    }, []);

    const login = (username, password) => {
        // Hardcoded credentials as requested
        if (username === 'myflix' && password === '1234') {
            setIsAuthenticated(true);
            localStorage.setItem('myflix_auth', 'true');
            return { success: true };
        }
        return { success: false, error: 'Invalid username or password' };
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentProfile(null);
        localStorage.removeItem('myflix_auth');
        // localStorage.removeItem('myflix_profile'); // Already handled by not saving it
    };

    const selectProfile = (profile) => {
        if (profile.isAdd) return;
        setCurrentProfile(profile);
        // Do NOT save to localStorage so it resets on reload
        // localStorage.setItem('myflix_profile', JSON.stringify(profile));
    };

    const clearProfile = () => {
        setCurrentProfile(null);
        // localStorage.removeItem('myflix_profile');
    };

    // Favorites / My List functions
    const addToMyList = (movie) => {
        const newList = [...myList, movie];
        setMyList(newList);
        localStorage.setItem('myflix_mylist', JSON.stringify(newList));
    };

    const removeFromMyList = (movieId) => {
        const newList = myList.filter(m => m.id !== movieId);
        setMyList(newList);
        localStorage.setItem('myflix_mylist', JSON.stringify(newList));
    };

    const isInMyList = (movieId) => {
        return myList.some(m => m.id === movieId);
    };

    const toggleMyList = (movie) => {
        if (isInMyList(movie.id)) {
            removeFromMyList(movie.id);
        } else {
            addToMyList(movie);
        }
    };

    const value = {
        isAuthenticated,
        currentProfile,
        profiles,
        isLoading,
        login,
        logout,
        selectProfile,
        clearProfile,
        // My List
        myList,
        addToMyList,
        removeFromMyList,
        isInMyList,
        toggleMyList
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
