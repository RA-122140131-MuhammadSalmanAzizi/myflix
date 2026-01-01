import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleAutoFill = () => {
        setUsername('myflix');
        setPassword('1234');
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please enter username and password');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Login with credentials
        const result = login(username, password);

        if (result.success) {
            navigate('/profiles');
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    // Movie posters for the background collage
    const moviePosters = [
        'https://img.youtube.com/vi/IkTkvdnrfr8/maxresdefault.jpg',
        'https://img.youtube.com/vi/_UmrvP21AXg/maxresdefault.jpg',
        'https://img.youtube.com/vi/fXvuQGRf5SI/maxresdefault.jpg',
        'https://img.youtube.com/vi/PmpWDHv1aNQ/maxresdefault.jpg',
        'https://img.youtube.com/vi/juGGDw6kZP0/maxresdefault.jpg',
        'https://img.youtube.com/vi/d_L4UZdQR50/maxresdefault.jpg',
    ];

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            {/* Background - Movie Poster Collage */}
            <div className="fixed inset-0 z-0">
                {/* Tilted grid of movie posters */}
                <div
                    className="absolute inset-0 scale-150"
                    style={{
                        transform: 'rotate(-10deg) scale(1.5)',
                        transformOrigin: 'center center'
                    }}
                >
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-4 h-full">
                        {[...Array(48)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[2/3] rounded overflow-hidden opacity-60"
                            >
                                <img
                                    src={moviePosters[i % moviePosters.length]}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/70" />
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4">
                <span className="netflix-font text-3xl md:text-4xl text-[#E50914] font-bold tracking-wider">
                    MYFLIX
                </span>
            </header>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-black/80 rounded-md p-8 md:p-14 animate-fadeInUp">
                    <h1 className="text-white text-3xl font-bold mb-7">Sign In</h1>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-[#E87C03] text-white px-4 py-3 rounded mb-4 text-sm animate-fadeIn">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Username Input */}
                        <div className="relative">
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#333] text-white rounded px-4 pt-5 pb-2 text-base outline-none border border-transparent focus:border-white/50 transition-colors peer"
                                placeholder=" "
                            />
                            <label
                                htmlFor="username"
                                className="absolute left-4 top-4 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
                            >
                                Email or mobile number
                            </label>
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#333] text-white rounded px-4 pt-5 pb-2 text-base outline-none border border-transparent focus:border-white/50 transition-colors peer"
                                placeholder=" "
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-4 top-4 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
                            >
                                Password
                            </label>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#E50914] hover:bg-[#F40612] text-white py-3 rounded font-semibold text-base transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>

                        {/* OR Divider */}
                        <div className="flex items-center gap-4 my-4">
                            <div className="flex-1 h-px bg-gray-600" />
                            <span className="text-gray-400 text-sm">OR</span>
                            <div className="flex-1 h-px bg-gray-600" />
                        </div>

                        {/* Login as Admin Button */}
                        <button
                            type="button"
                            onClick={handleAutoFill}
                            className="w-full bg-[#333]/80 hover:bg-[#444] text-white py-3 rounded font-semibold text-base transition-colors border border-gray-600"
                        >
                            Login as Admin
                        </button>

                        {/* Forgot Password Link */}
                        <div className="text-center mt-4">
                            <a href="#" className="text-gray-400 hover:underline text-sm">
                                Forgot password?
                            </a>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 accent-white bg-gray-600 rounded"
                            />
                            <label htmlFor="remember" className="text-gray-300 text-sm cursor-pointer">
                                Remember me
                            </label>
                        </div>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-10">
                        <p className="text-gray-400">
                            New to MyFlix?{' '}
                            <a href="#" className="text-white hover:underline font-medium">
                                Sign up now.
                            </a>
                        </p>
                    </div>

                    {/* Captcha Notice */}
                    <p className="text-gray-500 text-xs mt-4 leading-relaxed">
                        This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
                        <a href="#" className="text-blue-500 hover:underline">
                            Learn more.
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
