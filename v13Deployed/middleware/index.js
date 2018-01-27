var Places = require("../models/places");
var Comment = require("../models/comment");


//all the middleware goes here

var middlewareObj = {};

middlewareObj.checkPlacesOwnership = function(req,res,next){
if(req.isAuthenticated()){
         
      Places.findById(req.params.id,function(err,foundPlace){
         if(err){
            req.flash("error","Place not found");
            res.redirect("back");
         } else {
            // does user own the places
            
            if(foundPlace.author.id.equals(req.user._id)){
               
               next();
            }else{
               req.flash("error","You do not have permission to do that");
               res.redirect("back");
            }
       
         }
      });
      
   }else{
         req.flash("error","You need to be logged in to do that");
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
                 req.flash("error","You don't have permission to do that");
               res.redirect("back");
            }
       
         }
      });
      
   }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
         }
}


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
       
        return next();
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");

}


module.exports = middlewareObj;