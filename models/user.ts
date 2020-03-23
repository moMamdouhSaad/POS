var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: String,
    role: {type: Number, enum:[0, 1, 2]},
    password: String
});
var model = mongoose.model("users", userSchema);
module.exports = model;