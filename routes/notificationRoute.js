// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notificationController");

// Routes
router.get("/user/:userId", notificationController.getUserNotifications);
router.patch("/:id/read", notificationController.markAsRead);

module.exports = router;