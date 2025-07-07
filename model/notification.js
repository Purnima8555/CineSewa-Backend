const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false
    },
    type: {
      type: String,
      enum: ["booking", "login", "security", "system"],
      default: "system"
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});
  
module.exports = mongoose.model("Notification", notificationSchema);