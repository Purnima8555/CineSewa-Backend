const mongoose = require("mongoose");

// Seat schema
const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["available", "reserved", "sold"],
    default: "available"
  }
});

// Showtime schema
const showtimeSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movies",
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    time: {
      type: String,
      required: true
    },

    format: {
      type: String,
      enum: ["2D", "3D"],
      required: true
    },

    screenLabel: {
      type: String,
      default: "Main Hall"
    },

    priceRules: {
      type: Map,
      of: Number,
      default: {
        weekend_morning: 200,
        weekend_regular: 400,
        weekday_morning: 165,
        weekday_regular: 330,
        deal_all: 200
      }
    },

    // Additional price for 3D format
    extra3DCharge: {
      type: Number,
      default: 50
    },

    seatLayout: {
      type: [seatSchema],
      required: true
    }
  },
  { timestamps: true }
);

const Showtime = mongoose.model("Showtime", showtimeSchema);
module.exports = Showtime;
