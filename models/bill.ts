var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var billSchema = new Schema({
    serial_number: Number,
    bill_type:{type:String,enum:["dine-in","delivery","takeaway"]},
    bill_status:{ type: String, default: "Opened" ,enum:["Cashed","Opened","Printed"]},
    lines:
      {
      required:true,
      type:[
             {
        qty: {type:Number,default:1},
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
        total:Number        
              }
           ]
      }
    ,
    subtotal:{type:Number,default: function() {
      return 500
      }},
    tax_rate:Number,
    total:Number, //
});
autoIncrement.initialize(mongoose.connection);
billSchema.plugin(autoIncrement.plugin, { model: 'bills', field: 'serial_number' });
var model = mongoose.model("bills", billSchema);
module.exports = model;