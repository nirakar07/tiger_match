var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false},
    verified: {type: Boolean, default: false},
    verifyHash: Number // Only catches first 64 bits of MD5 hash
});
    

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
