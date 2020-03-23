var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    user_name: String,
    user_role: {type: Number, enum:[0, 1, 2]},
    user_password: String
});
var model = mongoose.model("users", userSchema);
module.exports = model;