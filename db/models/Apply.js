const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { CurrentTime } = require("../Date");

// Define the Apply schema
const applySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  workshop: { type: Schema.Types.ObjectId, ref: "Workshop", required: true },
  sendto: { type: String, required: true },
  requested_at: { type: String, required: true },
  updated_at: { type: String, required: true },
  status: { type: String, required: true },
});

const Apply = mongoose.model("Apply", applySchema);

async function insertApply(userId, productId, workshopId, sendto) {
  const time = await CurrentTime();
  const apply = new Apply({
    user: userId,
    product: productId,
    workshop: workshopId,
    sendto: sendto,
    requested_at: time,
    updated_at: time,
    status: "접수됨",
  });

  try {
    const savedApply = await apply.save();
    return savedApply;
  } catch (err) {
    console.error("Error inserting apply:", err);
  }
}

module.exports = Apply;
module.exports.insertApply = insertApply;
