var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    state: String,
    city: String,
   
    isAdmin: {
        type: "Boolean",
        default: false
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
    