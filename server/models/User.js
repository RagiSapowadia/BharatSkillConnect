const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  bio: String,
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    latitude: Number,
    longitude: Number,
  },
  isLocationPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
