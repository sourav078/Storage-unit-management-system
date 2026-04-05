const express = require("express");
const router = express.Router();

const {
  createStorageUnit,
  getStorageUnits,
  getStorageUnitById,
  searchStorageUnits,
  updateStorageUnit,
  deleteStorageUnit,
} = require("../controllers/storageUnitController");

const { protect, protectOptional } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const uploadStorageUnitPhotos = require("../middleware/uploadStorageUnitPhotos");

router.get("/search", protectOptional, searchStorageUnits);
router.get("/:id", protectOptional, getStorageUnitById);
router.get("/", protectOptional, getStorageUnits);

router.post(
  "/",
  protect,
  adminOnly,
  uploadStorageUnitPhotos.array("photos", 5),
  createStorageUnit
);

router.put(
  "/:id",
  protect,
  adminOnly,
  uploadStorageUnitPhotos.array("photos", 5),
  updateStorageUnit
);

router.delete("/:id", protect, adminOnly, deleteStorageUnit);

module.exports = router;