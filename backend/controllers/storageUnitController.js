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