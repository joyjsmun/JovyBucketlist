var mongoose = require("mongoose");

//Schema setup
var placeSchema = new mongoose.Schema({
   name:String,
   image:String,
   description:String,
   comments:[
           {
               type:mongoose.Schema.Types.ObjectId,
               ref:"Comment"
           }
       ]
});

//model
module.exports = mongoose.model("Places",placeSchema);

