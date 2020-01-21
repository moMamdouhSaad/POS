var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productSchema = new Schema({
  product_name: String,
  product_price: Number,
});
var model = mongoose.model("products", productSchema);
module.exports = model;