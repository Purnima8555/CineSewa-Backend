const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");

// Routes
router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
