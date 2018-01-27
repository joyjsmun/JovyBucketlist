var mongoose = require("mongoose");

//Schema setup
var placeSchema = new mongoose.Schema({
   name:String,
   when: String,
   image:String,
   description:String,
   author:{
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref:"User"
      },
      username:String
   },
   comments:[
           {
               type:mongoose.Schema.Types.ObjectId,
               ref:"Comment"
           }
       ]
});

//model
module.exports = mongoose.model("Places",placeSchema);

