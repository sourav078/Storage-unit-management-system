const mongoose = require("mongoose");

const storageUnitSchema = new mongoose.Schema(
  {
    unitNumber: {
      type: String,
      required: true,
      unique: true,
    },
    size: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    pricePerMonth: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StorageUnit", storageUnitSchema);