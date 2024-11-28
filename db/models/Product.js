const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  workshop: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  cost: { type: Number, required: true },
  price: { type: Number, default: null },
  size: { type: Array, required: true },
  reason: { type: String, required: true },
  img: { type: Array, required: true },
  status: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

async function insertProduct(workshop, name, category, cost, price = null, size, reason, img) {
  console.log(`workshop: ${workshop}`);
  const product = new Product({
    workshop: workshop,
    name: name,
    category: category,
    cost: cost,
    price: price,
    size: size,
    reason: reason,
    img: img,
    status: "나눔가능",
  });

  try {
    const savedProduct = await product.save();
    console.log("Product inserted:", savedProduct);
  } catch (err) {
    console.error("Error inserting product:", err);
  }
}

module.exports = Product;
module.exports.insertProduct = insertProduct;
