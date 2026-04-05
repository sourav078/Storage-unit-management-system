const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/storage-units", require("./routes/storageUnitRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      message: err.message || "File upload error",
    });
  }
  next();
});

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});