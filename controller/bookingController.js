const Booking = require("../model/booking");
const Showtime = require("../model/showtime");
const Notification = require("../model/notification");
const { createNotification } = require("./notificationController");
const Customer = require("../model/customer");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { userId, movieId, showtimeId, seats, format, totalPrice, paymentMethod } = req.body;

    console.log("Received booking request with data:", {
      userId,
      movieId,
      showtimeId,
      seats,
      format,
      totalPrice,
      paymentMethod
    });

    // Validate showtime exists
    const showtime = await Showtime.findById(showtimeId).populate("movieId");
    if (!showtime) {
      console.error("Showtime not found for ID:", showtimeId);
      return res.status(404).json({ message: "Showtime not found" });
    }

    // Check seat availability
    const unavailableSeats = seats.filter(seatNum => {
      const seat = showtime.seatLayout.find(s => s.seatNumber === seatNum);
      return !seat || seat.status !== "available";
    });

    if (unavailableSeats.length > 0) {
      console.error("Some selected seats are not available:", unavailableSeats);
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

    console.log("Booking created successfully:", newBooking);

    // Create notification
    const movieTitle = showtime.movieId.title;
    const showtimeDate = new Date(showtime.startTime).toLocaleString();
    const notificationMessage = `Your booking for ${movieTitle} on ${showtimeDate} (${format}) was successful. Seats: ${seats.join(", ")}. Total: NPR ${totalPrice}`;

    await createNotification(
      userId,
      newBooking._id,
      notificationMessage
    );

    // Generate QR Code
    const qrCodeData = `Booking ID: ${newBooking._id}\nMovie: ${movieTitle}\nShowtime: ${showtimeDate}\nSeats: ${seats.join(", ")}\nTotal: NPR ${totalPrice}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    // Send Email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "rpurnima8555@gmail.com",
        pass: "kwvuyzwguvdohwzu",
      }
    });

    const customer = await Customer.findById(userId);

    const mailOptions = {
      from: "rpurnima8555@gmail.com",
      to: customer.email,
      subject: 'Your Movie Booking Confirmation',
      text: notificationMessage,
      html: `
        <h1>Booking Confirmation</h1>
        <p>${notificationMessage}</p>
        <p><strong>Transaction Method:</strong> ${paymentMethod}</p>
        <p><strong>Important Instructions:</strong> Please arrive 15 minutes before the showtime. Present this QR code at the entrance.</p>
        <img src="cid:qrCode" />
      `,
      attachments: [
        {
          filename: 'ticket.png',
          content: qrCodeImage,
          cid: 'qrCode'
        }
      ]
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      // Optionally, you can return a response indicating the booking was successful but the email failed
      // return res.status(201).json({ message: "Booking created successfully, but email sending failed" });
    }

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

// In your bookingController.js
const getAllBookingsByUserId = async (req, res) => {
  console.log("\n=== Booking Controller ===");
  console.log("Params:", req.params);
  console.log("Headers:", req.headers);
  console.log("Request received at:", new Date());
  
  try {
    const { userId } = req.params;
    console.log("Searching bookings for user ID:", userId);
    
    const bookings = await Booking.find({ userId })
      .populate("movieId")
      .populate("showtimeId");
    
    console.log(`Found ${bookings.length} bookings`);
    console.log("Sample booking:", bookings[0]);
    
    res.json({ 
      success: true,
      message: "Bookings retrieved successfully", 
      bookings 
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
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

// bookingController.js
const getBookingCount = async (req, res) => {
  try {
    const count = await Booking.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error getting booking count:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getAllBookingsByUserId,
  getBookingById,
  deleteBooking,
  getBookingCount,
};