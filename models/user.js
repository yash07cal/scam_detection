var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    name: String,
    username: {type: String, unique: true, required: true},
    password: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    state: String,
    city: String,
    isAdmin: { type: "Boolean", default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
    