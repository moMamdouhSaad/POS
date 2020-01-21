var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var tableSchema = new Schema({
    table_number: Number,
});
autoIncrement.initialize(mongoose.connection);
tableSchema.plugin(autoIncrement.plugin, { model: 'tables', field: 'table_number' });
var model = mongoose.model("tables", tableSchema);
module.exports = model;