// Sample movie data for CineFind Web
// In a real app, this would come from an API like TMDB

export const sampleMovies = [
  {
    poster: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    title: "The Matrix",
    year: 1999,
    tagline: "Welcome to the Real World",
    genres: ["Action", "Sci-Fi"],
    runtime: 136,
    rating: 8.7,
    synopsis: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    title: "The Shawshank Redemption",
    year: 1994,
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    genres: ["Drama"],
    runtime: 142,
    rating: 9.3,
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    title: "The Godfather",
    year: 1972,
    tagline: "An offer you can't refuse.",
    genres: ["Crime", "Drama"],
    runtime: 175,
    rating: 9.2,
    synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/A6YPhJfi560BhI2a8t4fOVBx1Ty.jpg",
    title: "Inception",
    year: 2010,
    tagline: "Your mind is the scene of the crime",
    genres: ["Action", "Thriller", "Sci-Fi"],
    runtime: 148,
    rating: 8.8,
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    title: "Fight Club",
    year: 1999,
    tagline: "Mischief. Mayhem. Soap.",
    genres: ["Drama"],
    runtime: 139,
    rating: 8.8,
    synopsis: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
  },
  {
    poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    title: "Interstellar",
    year: 2014,
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    rating: 8.6,
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  }
];

export const heroMovies = sampleMovies.slice(0, 3);

export const movieSections = {
  trending: sampleMovies.slice(0, 4),
  topBoxOffice: sampleMovies.slice(1, 5),
  comingSoon: sampleMovies.slice(2, 6),
  personalized: sampleMovies.slice(0, 3),
};

export const genres = [
  "Action", "Adventure", "Comedy", "Crime", "Drama", "Fantasy", 
  "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "Western"
];

export const sampleCast = [
  {
    image: "https://image.tmdb.org/t/p/w185/bOlYWhVuOiU6azC4Bw6zlXZ5QTC.jpg",
    name: "Keanu Reeves",
    role: "Neo",
  },
  {
    image: "https://image.tmdb.org/t/p/w185/8iATAc5z5XOKFFARLsvaawa8MTY.jpg",
    name: "Laurence Fishburne",
    role: "Morpheus",
  },
  {
    image: "https://image.tmdb.org/t/p/w185/xqArcliU5lFf4c4VtzGHm1ARl5h.jpg",
    name: "Carrie-Anne Moss",
    role: "Trinity",
  },
];

export const sampleReviews = [
  {
    user: "MovieFan123",
    rating: 5,
    comment: "Absolutely mind-blowing! The visual effects and story are incredible. A true masterpiece of cinema.",
  },
  {
    user: "CinemaLover",
    rating: 4,
    comment: "Great movie with amazing action sequences. The philosophical elements really make you think.",
  },
  {
    user: "FilmCritic",
    rating: 5,
    comment: "Revolutionary filmmaking that changed the industry forever. Still holds up decades later.",
  },
];