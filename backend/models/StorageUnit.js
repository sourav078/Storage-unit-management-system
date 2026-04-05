const mongoose = require("mongoose");

const storageUnitSchema = new mongoose.Schema(
  {
    unitNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerMonth: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "inactive"],
      default: "available",
    },
    photos: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "A storage unit can have a maximum of 5 photos",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StorageUnit", storageUnitSchema);