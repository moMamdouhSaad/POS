var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var customerSchema = new Schema({
    customer_name: String,
    customer_phone: String,
    customer_address: String
});
var model = mongoose.model("customer", customerSchema);
module.exports = model;