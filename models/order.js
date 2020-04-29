const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const cartProduct = require("./productincart");

const orderSchema = new mongoose.Schema(
  {
    products: [cartProduct],
    transaction_id: {},
    amount: Number,
    address: String,
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
