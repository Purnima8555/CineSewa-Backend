const express = require("express");
const router = express.Router();
const showtimeController = require("../controller/showtimeController");

router.post("/", showtimeController.createShowtime); // Admin
router.put("/:id", showtimeController.updateShowtime); // Admin
router.delete("/:id", showtimeController.deleteShowtime); // Admin

router.get("/", showtimeController.getAllShowtimes); // User
router.get("/:id", showtimeController.getShowtimeById); // User
router.patch("/:id/seats", showtimeController.updateSeatStatus); // User (booking)

module.exports = router;
