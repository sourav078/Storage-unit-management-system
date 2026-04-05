const express = require("express");
const router = express.Router();

const {
  createStorageUnit,
  getStorageUnits,
  getStorageUnitById,
  searchStorageUnits,
} = require("../controllers/storageUnitController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/search", searchStorageUnits);
router.get("/:id", getStorageUnitById);
router.get("/", getStorageUnits);
router.post("/", protect, adminOnly, createStorageUnit);

module.exports = router;