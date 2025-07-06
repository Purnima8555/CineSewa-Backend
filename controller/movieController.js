const Movie = require('../model/movies');

// Get all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    console.log("Movies retrieved:", movies);
    res.status(200).json(movies);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ message: "Error fetching movies", error: err });
  }
};

// Get a specific movie by ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ message: "Error fetching movie", error: err });
  }
};

// Add a new movie
const addMovie = async (req, res) => {
  const {
    title,
    description,
    poster,
    genre,
    language,
    duration,
    releaseDate,
    trailerUrl,
    status,
    ageRating,
    director,
    cast
  } = req.body;

  try {
    let parsedGenre = [];
    if (typeof genre === 'string') {
      try {
        parsedGenre = JSON.parse(genre);
      } catch (e) {
        return res.status(400).json({ message: "Invalid genre format. Expected an array." });
      }
    } else {
      parsedGenre = genre;
    }

    const existingMovie = await Movie.findOne({ title, releaseDate });
    if (existingMovie) {
      return res.status(400).json({ message: "Movie with this title and release date already exists" });
    }

    const newMovie = new Movie({
      title,
      description,
      poster: req.file.filename,
      genre: parsedGenre,
      language,
      duration,
      releaseDate,
      trailerUrl,
      status,
      ageRating,
      director,
      cast
    });

    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(500).json({ message: "Error adding movie", error: err });
  }
};

// Update movie data
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = {};
    const currentMovie = await Movie.findById(id);

    if (!currentMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Loop over each field and only add to updatedFields if it's provided
    if (req.body.title) updatedFields.title = req.body.title;
    if (req.body.description) updatedFields.description = req.body.description;
    if (req.body.poster) updatedFields.poster = req.body.poster;
    if (req.body.language) updatedFields.language = req.body.language;
    if (req.body.duration) updatedFields.duration = req.body.duration;
    if (req.body.releaseDate) updatedFields.releaseDate = req.body.releaseDate;
    if (req.body.trailerUrl) updatedFields.trailerUrl = req.body.trailerUrl;
    if (req.body.status) updatedFields.status = req.body.status;
    if (req.body.ageRating) updatedFields.ageRating = req.body.ageRating;
    if (req.body.director) updatedFields.director = req.body.director;
    if (req.body.cast) updatedFields.cast = req.body.cast;

    // Handle genre parsing similar to book controller
    if (req.body.genre) {
      updatedFields.genre = Array.isArray(req.body.genre)
        ? req.body.genre
        : req.body.genre.split(",").map(item => item.trim());
    }

    const updatedMovie = await Movie.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch (err) {
    console.error("Error updating movie:", err);
    res.status(500).json({ message: "Error updating movie", error: err.message || err });
  }
};

// Delete a movie by ID
const deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findById(req.params.id);

    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).json({ message: "Error deleting movie", error: err });
  }
};

// Get movies by status
const getByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['now-showing', 'coming-soon', 'next-release'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const movies = await Movie.find({ status });

    if (movies.length === 0) {
      return res.status(404).json({ message: `No movies found for status: ${status}` });
    }

    res.status(200).json(movies);
  } catch (err) {
    console.error("Error fetching movies by status:", err);
    res.status(500).json({ message: "Error retrieving movies by status", error: err });
  }
};

// Get movies by genre
const getByGenre = async (req, res) => {
  try {
    const { genre } = req.params;

    const movies = await Movie.find({
      genre: { $in: [genre] }
    });

    if (movies.length === 0) {
      return res.status(404).json({ message: `No movies found for genre: ${genre}` });
    }

    res.status(200).json(movies);
  } catch (err) {
    console.error("Error fetching movies by genre:", err);
    res.status(500).json({ message: "Error retrieving movies by genre", error: err });
  }
};

// Search movies by title
const searchByTitle = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const movies = await Movie.find({
      title: { $regex: query, $options: 'i' }
    });

    if (movies.length === 0) {
      return res.status(404).json({ message: "No movies found matching the search criteria" });
    }

    res.status(200).json(movies);
  } catch (err) {
    console.error("Error searching movies by title:", err);
    res.status(500).json({ message: "Error searching movies", error: err });
  }
};

// Search movies by genres
const searchByGenres = async (req, res) => {
  try {
    const { genres } = req.query;

    if (!genres) {
      return res.status(400).json({ message: "Genres query is required" });
    }

    let parsedGenres = [];
    if (typeof genres === 'string') {
      try {
        parsedGenres = JSON.parse(genres);
      } catch (e) {
        parsedGenres = genres.split(",").map(item => item.trim());
      }
    } else {
      parsedGenres = genres;
    }

    const movies = await Movie.find({
      genre: { $in: parsedGenres.map(g => new RegExp(`^${g}$`, 'i')) }
    });

    if (movies.length === 0) {
      return res.status(404).json({ message: "No movies found for the specified genres" });
    }

    res.status(200).json(movies);
  } catch (err) {
    console.error("Error searching movies by genres:", err);
    res.status(500).json({ message: "Error searching movies by genres", error: err });
  }
};

// Search movies by language
const searchByLanguage = async (req, res) => {
  try {
    const { language } = req.query;

    if (!language) {
      return res.status(400).json({ message: "Language query is required" });
    }

    const movies = await Movie.find({
      language: { $regex: language, $options: 'i' }
    });

    if (movies.length === 0) {
      return res.status(404).json({ message: "No movies found for this language" });
    }

    res.status(200).json(movies);
  } catch (err) {
    console.error("Error searching movies by language:", err);
    res.status(500).json({ message: "Error searching movies by language", error: err });
  }
};

// Get total movie count
const getMovieCount = async (req, res) => {
  try {
    const count = await Movie.countDocuments();
    console.log("Total movies in database:", count);
    res.status(200).json({ count });
  } catch (err) {
    console.error("Error fetching movie count:", err);
    res.status(500).json({ message: "Error fetching movie count", error: err.message || err });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
  getByStatus,
  getByGenre,
  searchByTitle,
  searchByGenres,
  searchByLanguage,
  getMovieCount
};