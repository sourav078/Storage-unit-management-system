const Booking = require("../models/Booking");
const StorageUnit = require("../models/StorageUnit");

exports.createBooking = async (req, res) => {
  try {
    const { storageUnit, startDate } = req.body;

    const unit = await StorageUnit.findById(storageUnit);

    if (!unit || unit.status !== "available") {
      return res.status(400).json({ message: "Storage unit is not available" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      storageUnit,
      startDate,
    });

    unit.status = "occupied";
    await unit.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("storageUnit");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};