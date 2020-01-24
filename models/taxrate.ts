var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var taxrateSchema = new Schema({
  tax_rate: {type:Number},
},
{timestamps: true}
);
var model = mongoose.model("taxrates", taxrateSchema);
module.exports = model;