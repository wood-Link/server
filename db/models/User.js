// User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const { CurrentTime } = require("../Date");

const userSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
  deleted_at: { type: String, default: null },
});

const User = mongoose.model("User", userSchema);

async function insertUser(name, phone, address, id = null) {
  const time = await CurrentTime();
  phone = phone.replaceAll("-", "").trim();
  name = name.trim();
  const user = new User({
    name: name,
    phone: phone,
    address: address,
    created_at: time,
    updated_at: time,
  });

  try {
    id ? (user._id = id) : false;
    const savedUser = await user.save();
    return savedUser;
  } catch (err) {
    console.error("Error inserting user:", err);
    throw err;
  }
}

module.exports = User;
module.exports.insertUser = insertUser;
