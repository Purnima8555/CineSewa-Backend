const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: false,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movies",
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Showtime",
    required: true,
  },
  seats: {
    type: [String],
    required: true,
  },
  format: {
    type: String,
    enum: ["2D", "3D"],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "failed"],
    default: "paid",
  },
  paymentMethod: {
    type: String,
    default: "esewa",
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
