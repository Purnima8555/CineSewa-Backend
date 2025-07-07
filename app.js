const express = require("express");
const path = require("path");
const connectDb = require("./config/db");

const CustomerRouter = require("./routes/customerRoute");
const AuthRouter = require("./routes/authRoute");
const MovieRouter = require("./routes/movieRoute");
const ShowtimeRouter = require("./routes/showtimeRoute");
const BookingRouter = require("./routes/bookingRoute");
const notificationRouter = require("./routes/notificationRoute");

const app = express();
connectDb();

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());

// routes
app.use("/api/customer", CustomerRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/movies", MovieRouter);
app.use("/api/showtimes", ShowtimeRouter);
app.use("/api/bookings", BookingRouter);
app.use("/api/notifications", notificationRouter);

// static files
app.use("/profilePicture", express.static("public/profilePicture"));
app.use("/movie_posters", express.static(path.join(__dirname, "movie_posters")));

module.exports = app;
