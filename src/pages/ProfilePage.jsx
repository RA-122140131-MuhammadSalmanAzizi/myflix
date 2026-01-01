import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

    return icons[type] || icons.user;
};

const ProfilePage = () => {
    const { profiles, selectProfile, logout } = useAuth();
    const navigate = useNavigate();

    const handleProfileSelect = (profile) => {
        if (profile.isAdd) {
            // Handle add profile (just show alert for demo)
            alert('Add Profile feature coming soon!');
            return;
        }
        selectProfile(profile);
        navigate('/browse');
    };

    return (
        <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-4">
            {/* Header Logo */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center">
                <span className="netflix-font text-3xl md:text-4xl text-[#E50914] font-bold tracking-wider">
                    MYFLIX
                </span>
                <button
                    onClick={logout}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                    Sign Out
                </button>
            </header>

            {/* Profile Selection */}
            <div className="animate-fadeInUp text-center">
                <h1 className="text-white text-3xl md:text-5xl font-medium mb-2">Who's watching?</h1>
                <p className="text-gray-400 mb-10">Select a profile to start streaming</p>

                {/* Profiles Grid */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                    {profiles.map((profile) => (
                        <button
                            key={profile.id}
                            onClick={() => handleProfileSelect(profile)}
                            className="profile-card group flex flex-col items-center"
                        >
                            {/* Profile Avatar */}
                            <div
                                className={`w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-md bg-gradient-to-br ${profile.color} flex items-center justify-center mb-3 profile-border border-2 border-transparent transition-all duration-300 ${profile.isAdd ? 'border-gray-600 border-dashed' : ''}`}
                            >
                                <ProfileIcon type={profile.iconType} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white" />
                            </div>

                            {/* Profile Name */}
                            <span className="text-gray-400 group-hover:text-white transition-colors text-sm md:text-base">
                                {profile.name}
                            </span>

                            {/* Kids Badge */}
                            {profile.isKid && (
                                <span className="mt-1 text-xs text-blue-400">Kids</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Manage Profiles Button */}
                <button className="mt-12 px-6 py-2 border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors text-sm tracking-wider">
                    MANAGE PROFILES
                </button>
            </div>

            {/* Decorative Elements */}
            <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>
    );
};

export default ProfilePage;
