const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    language: {
        type: String,
        enum: ["Nepali", "English", "Hindi"],
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    trailerUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["now-showing", "coming-soon", "next-release"],
      required: true,
    },
    ageRating: {
      type: String,
      enum: ["U", "PG", "15+", "A"],
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    cast: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("movies", movieSchema);

module.exports = Movie;
