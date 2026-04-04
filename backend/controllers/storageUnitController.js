const StorageUnit = require("../models/StorageUnit");

exports.createStorageUnit = async (req, res) => {
  try {
    const storageUnit = await StorageUnit.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(storageUnit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStorageUnits = async (req, res) => {
  try {
    const storageUnits = await StorageUnit.find();
    res.status(200).json(storageUnits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStorageUnitById = async (req, res) => {
  try {
    const storageUnit = await StorageUnit.findById(req.params.id);

    if (!storageUnit) {
      return res.status(404).json({ message: "Storage unit not found" });
    }

    res.status(200).json(storageUnit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchStorageUnits = async (req, res) => {
  try {
    const query = req.query.q || "";

    const storageUnits = await StorageUnit.find({
      $or: [
        { location: { $regex: query, $options: "i" } },
        { size: { $regex: query, $options: "i" } },
        { unitNumber: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(storageUnits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};