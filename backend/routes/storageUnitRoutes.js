const express = require("express");
const router = express.Router();

const {
  createStorageUnit,
  getStorageUnits,
  getStorageUnitById,
  searchStorageUnits,
} = require("../controllers/storageUnitController");

const { protect } = require("../middleware/authMiddleware");

router.get("/search", searchStorageUnits);
router.get("/:id", getStorageUnitById);
router.post("/", protect, createStorageUnit);
router.get("/", getStorageUnits);

module.exports = router;