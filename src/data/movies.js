// Movie data with YouTube video IDs
export const movies = [
    {
        id: 1,
        title: "Restart the Earth",
        year: 2021,
        youtubeId: "IkTkvdnrfr8",
        genre: ["Sci-Fi", "Action", "Thriller"],
        duration: "1h 47m",
        maturity: "16+",
        description: "In a post-apocalyptic world overrun by mutated plants, a former soldier must escort a young girl who holds the key to humanity's survival across a dangerous landscape where nature has turned deadly.",
        match: 95,
        isNew: false,
        isTrending: true,
        thumbnail: "https://m.media-amazon.com/images/M/MV5BZmIzNGYwMGQtYWQzZC00YjljLWEyY2QtNTY4ODY1NzIyNzgyXkEyXkFqcGc@._V1_.jpg",
        backdrop: `https://img.youtube.com/vi/IkTkvdnrfr8/maxresdefault.jpg`,
        cast: ["He Shengming", "Feng Rachel", "Mickey"],
        director: "Zhenzhao Lin"
    },
    {
        id: 2,
        title: "Toba Dreams",
        year: 2015,
        youtubeId: "_UmrvP21AXg",
        genre: ["Drama", "Family"],
        duration: "2h 5m",
        maturity: "13+",
        description: "A story about a retired army sergeant who moves his family from Jakarta to the Batak highlands of North Sumatra, where they must adjust to a new way of life and reconnect with their roots.",
        match: 88,
        isNew: false,
        isTrending: false,
        thumbnail: "https://upload.wikimedia.org/wikipedia/id/7/72/TOBADREAMSFILM.JPG",
        backdrop: `https://img.youtube.com/vi/_UmrvP21AXg/maxresdefault.jpg`,
        cast: ["Vino G. Bastian", "Marsha Timothy", "Haykal Kamil"],
        director: "Benni Setiawan"
    },
    {
        id: 3,
        title: "Filosofi Kopi",
        year: 2015,
        youtubeId: "fXvuQGRf5SI",
        genre: ["Drama", "Romance"],
        duration: "1h 57m",
        maturity: "13+",
        description: "Two best friends with opposing philosophies run a coffee shop together. When financial troubles threaten their business, they must find a way to create the perfect cup of coffee to save everything they've built.",
        match: 92,
        isNew: false,
        isTrending: true,
        thumbnail: "https://upload.wikimedia.org/wikipedia/id/2/2c/Poster_film_Filosofi_Kopi_2015.jpg",
        backdrop: `https://img.youtube.com/vi/fXvuQGRf5SI/maxresdefault.jpg`,
        cast: ["Rio Dewanto", "Chicco Jerikho", "Julie Estelle"],
        director: "Angga Dwimas Sasongko"
    },
    {
        id: 4,
        title: "The Canterville Ghost",
        year: 2023,
        youtubeId: "PmpWDHv1aNQ",
        genre: ["Comedy", "Fantasy", "Family"],
        duration: "1h 33m",
        maturity: "PG",
        description: "An American family moves into a haunted British mansion, where they encounter the ghost of Sir Simon de Canterville who has been haunting the estate for centuries.",
        match: 85,
        isNew: true,
        isTrending: true,
        thumbnail: "https://m.media-amazon.com/images/M/MV5BNTZkZTk5M2QtN2QyMC00ZjdiLTgzNjctNGFkYTg0OGZjZjhiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        backdrop: `https://img.youtube.com/vi/PmpWDHv1aNQ/maxresdefault.jpg`,
        cast: ["Stephen Fry", "Hugh Laurie", "Freddie Highmore"],
        director: "Kim Burdon"
    },
    {
        id: 5,
        title: "Zombie Night",
        year: 2013,
        youtubeId: "juGGDw6kZP0",
        genre: ["Horror", "Thriller"],
        duration: "1h 26m",
        maturity: "18+",
        description: "Two families must survive a terrifying night when the dead rise from their graves. As zombies overrun their neighborhood, they must work together to make it until dawn.",
        match: 78,
        isNew: false,
        isTrending: false,
        thumbnail: "https://play-lh.googleusercontent.com/OhDZVwwl71-eXZAdV5rP1yHF2zm5_oNoRRz983dQsxq_6MwuHpD4XwIApEm7RF9oOiAi",
        backdrop: `https://img.youtube.com/vi/juGGDw6kZP0/maxresdefault.jpg`,
        cast: ["Daryl Hannah", "Anthony Michael Hall", "Shirley Jones"],
        director: "John Gulager"
    },
    {
        id: 6,
        title: "Hercules Reborn",
        year: 2014,
        youtubeId: "d_L4UZdQR50",
        genre: ["Action", "Fantasy", "Adventure"],
        duration: "1h 30m",
        maturity: "16+",
        description: "When a young man's bride is kidnapped by an evil king, he turns to the legendary Hercules for help. Together they embark on an epic adventure to rescue her and defeat the tyrant.",
        match: 82,
        isNew: false,
        isTrending: false,
        thumbnail: "https://play-lh.googleusercontent.com/JvEthp4AYBTYXhdjsSJix47bTfoAmN28fi5YFmmYGYjEfRCyCrOZTFrVUzXtkmh4ww0r",
        backdrop: `https://img.youtube.com/vi/d_L4UZdQR50/maxresdefault.jpg`,
        cast: ["John Hennigan", "Christian Oliver", "James Duval"],
        director: "Nick Lyon"
    }
];

// Coming Soon Movies
export const comingSoonMovies = [
    {
        id: 101,
        title: "Shadow Warriors",
        year: 2025,
        genre: ["Action", "Thriller"],
        description: "An elite team of operatives must stop a global threat.",
        releaseDate: "Coming January 2025",
        isComingSoon: true,
        thumbnail: null
    },
    {
        id: 102,
        title: "The Last Kingdom",
        year: 2025,
        genre: ["Fantasy", "Adventure"],
        description: "A fallen prince must reclaim his throne from an evil sorcerer.",
        releaseDate: "Coming February 2025",
        isComingSoon: true,
        thumbnail: null
    },
    {
        id: 103,
        title: "Midnight Express",
        year: 2025,
        genre: ["Mystery", "Thriller"],
        description: "A detective investigates a series of mysterious disappearances on a luxury train.",
        releaseDate: "Coming March 2025",
        isComingSoon: true,
        thumbnail: null
    },
    {
        id: 104,
        title: "Ocean's Deep",
        year: 2025,
        genre: ["Sci-Fi", "Horror"],
        description: "A deep-sea research team discovers something ancient and terrifying.",
        releaseDate: "Coming April 2025",
        isComingSoon: true,
        thumbnail: null
    }
];

// Profile icons as SVG paths (no emojis for professional look)
export const profileIcons = {
    movie: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
    kid: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-6c.78 2.34 2.72 4 5 4s4.22-1.66 5-4H7z"/></svg>`,
    add: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`
};

// User profiles (using icon types instead of emojis)
export const profiles = [
    {
        id: 1,
        name: "MyFlix",
        iconType: "movie",
        color: "from-red-600 to-red-800",
        isKid: false
    },
    {
        id: 2,
        name: "Guest",
        iconType: "user",
        color: "from-blue-600 to-blue-800",
        isKid: false
    },
    {
        id: 3,
        name: "Kids",
        iconType: "kid",
        color: "from-green-500 to-green-700",
        isKid: true
    },
    {
        id: 4,
        name: "Add Profile",
        iconType: "add",
        color: "from-gray-600 to-gray-800",
        isAdd: true
    }
];

// Categories for browsing
export const categories = [
    { id: 'all', name: 'All' },
    { id: 'action', name: 'Action' },
    { id: 'drama', name: 'Drama' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'horror', name: 'Horror' },
    { id: 'scifi', name: 'Sci-Fi' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'family', name: 'Family' }
];

// Row categories for home page
export const rowCategories = [
    { id: 'trending', title: 'Trending Now', filter: (m) => m.isTrending },
    { id: 'all', title: 'Popular on MyFlix', filter: () => true },
    { id: 'action', title: 'Action Movies', filter: (m) => m.genre.includes('Action') },
    { id: 'drama', title: 'Drama', filter: (m) => m.genre.includes('Drama') },
    { id: 'horror', title: 'Horror & Thriller', filter: (m) => m.genre.includes('Horror') || m.genre.includes('Thriller') },
    { id: 'fantasy', title: 'Fantasy & Sci-Fi', filter: (m) => m.genre.includes('Fantasy') || m.genre.includes('Sci-Fi') },
    { id: 'new', title: 'New Releases', filter: (m) => m.isNew },
    { id: 'coming', title: 'Coming Soon', filter: () => true, isComingSoon: true }
];

// Get YouTube embed URL
export const getYouTubeEmbedUrl = (videoId, autoplay = false) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&controls=1`;
};

// Get YouTube thumbnail URL
export const getYouTubeThumbnail = (videoId, quality = 'maxresdefault') => {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};
