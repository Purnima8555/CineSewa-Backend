const Showtime = require("../model/showtime");
const generateSeatLayout = require("../utils/seatLayout");

// Admin: Create new showtime
const createShowtime = async (req, res) => {
  try {
    const { movieId, date, time, format, priceRules, extra3DCharge } = req.body;

    const seatLayout = generateSeatLayout();

    const newShowtime = new Showtime({
      movieId,
      date,
      time,
      format,
      priceRules,
      extra3DCharge,
      seatLayout
    });

    await newShowtime.save();
    res.status(201).json({ message: "Showtime created successfully", showtime: newShowtime });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update a showtime
const updateShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Showtime.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Showtime not found" });
    res.json({ message: "Showtime updated", showtime: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Delete a showtime
const deleteShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Showtime.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Showtime not found" });
    res.json({ message: "Showtime deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User: Get all showtimes
const getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find().populate("movieId");
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User: Get a showtime by ID
const getShowtimeById = async (req, res) => {
  try {
    const { id } = req.params;
    const showtime = await Showtime.findById(id).populate("movieId");
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User: Update seat status (e.g. for booking)
const updateSeatStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { selectedSeats, newStatus } = req.body;

    const showtime = await Showtime.findById(id);
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });

    // Update each seat
    showtime.seatLayout = showtime.seatLayout.map(seat => {
      if (selectedSeats.includes(seat.seatNumber) && seat.status === "available") {
        return { ...seat.toObject(), status: newStatus };
      }
      return seat;
    });

    await showtime.save();
    res.json({ message: "Seat statuses updated", seatLayout: showtime.seatLayout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getAllShowtimes,
  getShowtimeById,
  updateSeatStatus
};
