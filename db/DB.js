const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const uri = process.env.MONGODB_URI || "";
const User = require("./models/User.js");
const Workshop = require("./models/Workshop");
const Product = require("./models/Product");
const Review = require("./models/Review");
const Apply = require("./models/Apply");

// Set up Mongoose connection options
const options = {
  serverApi: {
    version: "1", // Set the MongoDB API version if needed
    strict: true,
    deprecationErrors: true,
  },
};

async function connectDB() {
  try {
    // Set up Mongoose connection options
    const options = {
      serverApi: {
        version: "1", // Set the MongoDB API version if needed
        strict: true,
        deprecationErrors: true,
      },
    };
    // Connect to MongoDB
    await mongoose.connect(uri, options);
    console.log("Successfully connected to MongoDB!");

    // Ping the database to verify the connection
    await mongoose.connection.db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Re-throw the error so it can be handled upstream
  }
}

module.exports = { connectDB };
