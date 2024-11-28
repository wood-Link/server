const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workshopSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  content: { type: String, default: null },
  status: { type: String, default: "active" },
});

const Workshop = mongoose.model("Workshop", workshopSchema);

async function insertWorkshop(name, phone, address, content = null) {
  const workshop = new Workshop({
    name: name,
    phone: phone,
    address: address,
    content: content,
    status: "active",
  });

  try {
    const savedWorkshop = await workshop.save();
    console.log("Workshop inserted:", savedWorkshop);
  } catch (err) {
    console.error("Error inserting workshop:", err);
  }
}

module.exports = Workshop;
module.exports.insertWorkshop = insertWorkshop;
