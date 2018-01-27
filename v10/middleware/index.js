var Places = require("../models/places");
var Comment = require("../models/comment");


//all the middleware goes here

var middlewareObj = {};

middlewareObj.checkPlacesOwnership = function(req,res,next){
if(req.isAuthenticated()){
         
      Places.findById(req.params.id,function(err,foundPlace){
         if(err){
            res.redirect("back");
         } else {
            // does user own the places
            
            if(foundPlace.author.id.equals(req.user._id)){
               next();
            }else{
               res.redirect("back");
            }
       
         }
      });
      
   }else{
        res.redirect("back");
         }


}


middlewareObj.checkCommentsOwnership = function(req,res,next){
if(req.isAuthenticated()){
         
      Comment.findById(req.params.comment_id,function(err,foundComment){
         if(err){
            res.redirect("back");
         } else {
            // does user own the places
            
            if(foundComment.author.id.equals(req.user._id)){
               next();
            }else{
               res.redirect("back");
            }
       
         }
      });
      
   }else{
        res.redirect("back");
         }
}


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

}


module.exports = middlewareObj;