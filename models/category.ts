var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var categorySchema = new Schema({
    category_name: String,
});
var model = mongoose.model("categorys", categorySchema);
module.exports = model;