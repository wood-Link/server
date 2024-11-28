const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  content: { type: String, required: true },
  img: { type: String, required: true },
});

const Review = mongoose.model("Review", reviewSchema);

async function insertReview(user, product, content, img) {
  const review = new Review({
    user: user,
    product: product,
    content: content,
    img: img,
  });

  try {
    const savedReview = await review.save();
    console.log("Review inserted:", savedReview);
  } catch (err) {
    console.error("Error inserting review:", err);
  }
}

module.exports = Review;
module.exports.insertReview = insertReview;
