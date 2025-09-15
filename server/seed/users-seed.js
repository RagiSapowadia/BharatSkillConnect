const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const users = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    role: "teacher",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "password123",
    role: "teacher",
  },
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    password: "password123",
    role: "student",
  },
  {
    name: "Bob Wilson",
    email: "bob.wilson@example.com",
    password: "password123",
    role: "student",
  },
  {
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    password: "password123",
    role: "student",
  },
];

async function seedUsers() {
  try {
    require("dotenv").config();
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding users");

    await User.deleteMany({});
    console.log("Deleted existing users");

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log("Seeded users successfully");

    // Display the seeded users
    console.log("\nSeeded Users:");
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.role}) - ${user.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();
