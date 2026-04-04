const express = require("express");
const router = express.Router();

const {
  createStorageUnit,
  getStorageUnits,
} = require("../controllers/storageUnitController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createStorageUnit);
router.get("/", protect, getStorageUnits);

module.exports = router;