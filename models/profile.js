var mongoose = require("mongoose");

var profileSchema = new mongoose.Schema({
   Time: String,
   Year: String,
   interest: String,
   createdAt: { type: Date, default: Date.now },
   q1: String,
   q2: String,
   q3: String,
   q4: String,
   q5: String,
   q6: String,
   author: String
});

module.exports = mongoose.model("Profile", profileSchema);
