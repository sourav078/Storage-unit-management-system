const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  storageUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StorageUnit",
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);