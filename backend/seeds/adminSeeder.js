const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const adminUser = await User.create({
      name: "System Admin",
      email: adminEmail,
      password: adminPassword,
      address: "Brisbane, Australia",
      role: "admin",
    });

    console.log("Admin user created successfully");
    console.log({
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();