
var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
   title: String,
   isApproved: {
        type: "Boolean",
        default: false
    },
   isScam: {
      type: "Boolean",
      default: false
   },
   image: String,
   state: String,
   city: String,
   description: String,
   user: {
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
    },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Post", postSchema);