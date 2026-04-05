const fs = require("fs");
const path = require("path");
const StorageUnit = require("../models/StorageUnit");

const buildPhotoPaths = (files) => {
  if (!files || !Array.isArray(files)) return [];
  return files.map((file) => `/uploads/storage-units/${file.filename}`);
};

const deletePhotosFromDisk = (photoPaths) => {
  if (!Array.isArray(photoPaths)) return;

  photoPaths.forEach((photoPath) => {
    const fileName = path.basename(photoPath);
    const absolutePath = path.join(
      __dirname,
      "../uploads/storage-units",
      fileName
    );

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  });
};

const normalizePrice = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

exports.createStorageUnit = async (req, res) => {
  try {
    const {
      unitNumber,
      size,
      location,
      pricePerMonth,
      description,
      status,
    } = req.body;

    if (!unitNumber || !size || !location || pricePerMonth === undefined) {
      deletePhotosFromDisk(buildPhotoPaths(req.files));
      return res.status(400).json({
        message: "unitNumber, size, location, and pricePerMonth are required",
      });
    }

    const normalizedPrice = normalizePrice(pricePerMonth);

    if (normalizedPrice === null) {
      deletePhotosFromDisk(buildPhotoPaths(req.files));
      return res.status(400).json({
        message: "pricePerMonth must be a valid non-negative number",
      });
    }

    const allowedStatuses = ["available", "occupied", "inactive"];
    if (status && !allowedStatuses.includes(status)) {
      deletePhotosFromDisk(buildPhotoPaths(req.files));
      return res.status(400).json({ message: "Invalid status value" });
    }

    const existingUnit = await StorageUnit.findOne({
      unitNumber: unitNumber.trim(),
    });

    if (existingUnit) {
      deletePhotosFromDisk(buildPhotoPaths(req.files));
      return res.status(400).json({ message: "Unit number already exists" });
    }

    const photoPaths = buildPhotoPaths(req.files);

    const storageUnit = await StorageUnit.create({
      unitNumber: unitNumber.trim(),
      size: size.trim(),
      location: location.trim(),
      pricePerMonth: normalizedPrice,
      description: description?.trim() || "",
      status: status || "available",
      photos: photoPaths,
      createdBy: req.user._id,
    });

    return res.status(201).json(storageUnit);
  } catch (error) {
    deletePhotosFromDisk(buildPhotoPaths(req.files));
    return res.status(500).json({ message: error.message });
  }
};

exports.getStorageUnits = async (req, res) => {
  try {
    const storageUnits = await StorageUnit.find().sort({ createdAt: -1 });
    return res.status(200).json(storageUnits);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getStorageUnitById = async (req, res) => {
  try {
    const storageUnit = await StorageUnit.findById(req.params.id);

    if (!storageUnit) {
      return res.status(404).json({ message: "Storage unit not found" });
    }

    return res.status(200).json(storageUnit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.searchStorageUnits = async (req, res) => {
  try {
    const query = (req.query.q || "").trim();

    const storageUnits = await StorageUnit.find({
      $or: [
        { location: { $regex: query, $options: "i" } },
        { size: { $regex: query, $options: "i" } },
        { unitNumber: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json(storageUnits);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateStorageUnit = async (req, res) => {
  try {
    const storageUnit = await StorageUnit.findById(req.params.id);

    if (!storageUnit) {
      deletePhotosFromDisk(buildPhotoPaths(req.files));
      return res.status(404).json({ message: "Storage unit not found" });
    }

    const {
      unitNumber,
      size,
      location,
      pricePerMonth,
      description,
      status,
      removeExistingPhotos,
    } = req.body;

    if (unitNumber && unitNumber.trim() !== storageUnit.unitNumber) {
      const existingUnit = await StorageUnit.findOne({
        unitNumber: unitNumber.trim(),
        _id: { $ne: storageUnit._id },
      });

      if (existingUnit) {
        deletePhotosFromDisk(buildPhotoPaths(req.files));
        return res.status(400).json({ message: "Unit number already exists" });
      }

      storageUnit.unitNumber = unitNumber.trim();
    }

    if (size) storageUnit.size = size.trim();
    if (location) storageUnit.location = location.trim();

    if (pricePerMonth !== undefined) {
      const normalizedPrice = normalizePrice(pricePerMonth);

      if (normalizedPrice === null) {
        deletePhotosFromDisk(buildPhotoPaths(req.files));
        return res.status(400).json({
          message: "pricePerMonth must be a valid non-negative number",
        });
      }

      storageUnit.pricePerMonth = normalizedPrice;
    }

    if (typeof description === "string") {
      storageUnit.description = description.trim();
    }

    if (status) {
      const allowedStatuses = ["available", "occupied", "inactive"];
      if (!allowedStatuses.includes(status)) {
        deletePhotosFromDisk(buildPhotoPaths(req.files));
        return res.status(400).json({ message: "Invalid status value" });
      }
      storageUnit.status = status;
    }

    let existingPhotos = [...(storageUnit.photos || [])];
    let parsedPhotosToRemove = [];

    if (removeExistingPhotos) {
      try {
        parsedPhotosToRemove = JSON.parse(removeExistingPhotos);
      } catch {
        parsedPhotosToRemove = [];
      }

      if (!Array.isArray(parsedPhotosToRemove)) {
        parsedPhotosToRemove = [];
      }

      existingPhotos = existingPhotos.filter(
        (photo) => !parsedPhotosToRemove.includes(photo)
      );
    }

    const newPhotoPaths = buildPhotoPaths(req.files);

    if (existingPhotos.length + newPhotoPaths.length > 5) {
      deletePhotosFromDisk(newPhotoPaths);
      return res.status(400).json({
        message: "A storage unit can have a maximum of 5 photos",
      });
    }

    storageUnit.photos = [...existingPhotos, ...newPhotoPaths];

    const updatedStorageUnit = await storageUnit.save();

    if (parsedPhotosToRemove.length > 0) {
      deletePhotosFromDisk(parsedPhotosToRemove);
    }

    return res.status(200).json(updatedStorageUnit);
  } catch (error) {
    deletePhotosFromDisk(buildPhotoPaths(req.files));
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteStorageUnit = async (req, res) => {
  try {
    const storageUnit = await StorageUnit.findById(req.params.id);

    if (!storageUnit) {
      return res.status(404).json({ message: "Storage unit not found" });
    }

    deletePhotosFromDisk(storageUnit.photos);
    await storageUnit.deleteOne();

    return res.status(200).json({ message: "Storage unit deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};