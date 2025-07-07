const Booking = require("../model/booking");
const Showtime = require("../model/showtime");
const Notification = require("../model/notification");
const { createNotification } = require("./notificationController");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { userId, movieId, showtimeId, seats, format, totalPrice, paymentMethod } = req.body;

    // Validate showtime exists
    const showtime = await Showtime.findById(showtimeId).populate("movieId");
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    // Check seat availability
    const unavailableSeats = seats.filter(seatNum => {
      const seat = showtime.seatLayout.find(s => s.seatNumber === seatNum);
      return !seat || seat.status !== "available";
    });

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: "Some selected seats are not available",
        unavailableSeats
      });
    }

    // Update seat status to "sold"
    showtime.seatLayout = showtime.seatLayout.map(seat => {
      if (seats.includes(seat.seatNumber)) {
        return { ...seat.toObject(), status: "sold" };
      }
      return seat;
    });

    await showtime.save();

    // Create and save booking
    const newBooking = new Booking({
      userId,
      movieId,
      showtimeId,
      seats,
      format,
      totalPrice,
      paymentMethod,
      paymentStatus: "paid"
    });

    await newBooking.save();

    // Create notification
    const movieTitle = showtime.movieId.title;
    const showtimeDate = new Date(showtime.startTime).toLocaleString();
    const notificationMessage = `Your booking for ${movieTitle} on ${showtimeDate} (${format}) was successful. Seats: ${seats.join(", ")}. Total: NPR ${totalPrice}`;

    await createNotification(
      userId,
      newBooking._id,
      notificationMessage
    );

    res.status(201).json({ 
      message: "Booking created successfully", 
      booking: newBooking 
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("movieId").populate("showtimeId");
    res.json({ message: "Bookings retrieved successfully", bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("movieId").populate("showtimeId");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking retrieved successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  deleteBooking
};