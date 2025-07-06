const express = require("express");
const router = express.Router();

const {
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
} = require("../controller/movieController");

const { authenticateToken, authorizeRole } = require("../security/authorization");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../movie_posters");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'), false);
    }
  },
});

// Specific routes first
router.get("/count", authenticateToken, getMovieCount);
router.get("/", getAllMovies);
router.get("/status/:status", getByStatus);
router.get("/genre/:genre", getByGenre);
router.get("/search/title", searchByTitle);
router.get("/search/genres", searchByGenres);
router.get("/search/language", searchByLanguage);

// Dynamic routes after specific routes
router.get("/:id", getMovieById);
router.post("/add", upload.single("poster"), authenticateToken, addMovie);
router.put("/update/:id", upload.single("poster"), authenticateToken, updateMovie);
router.delete("/delete/:id", authenticateToken, deleteMovie);

module.exports = router;