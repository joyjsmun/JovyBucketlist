var express = require("express");
var router = express.Router({mergeParams:true});
var Places = require("../models/places");
var Comment = require("../models/comment");
var middleware = require("../middleware");


 
 router.get("/new",middleware.isLoggedIn,function(req,res){
    //find places by ID
    Places.findById(req.params.id,function(err,place){
       if(err){
          console.log(err);
       }else{
          res.render("comments/new",{place:place})
       }
    })
    
 });
 
 
 router.post("/",middleware.isLoggedIn,function(req,res){
    //lookup campgound using ID
    Places.findById(req.params.id,function(err, place) {
       if(err){
          req.flash("error","Something went wrong");
          console.log(err);
          res.redirect("/places");
       } else{
             Comment.create(req.body.comment,function(err,comment){
                if(err){
                   console.log(err);
                }else{
                 //add username and id to comment
                 
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 //save comment
                 comment.save();
                place.comments.push(comment._id);
                place.save();
                req.flash("sucess","Successfully added comment");
                res.redirect('/places/'+place._id);
                }
             });
             
        }
       
    });
    //create new comments
    //connect new comments to places
    //redirect place show page
 });
 
 
 
 // edit comments route
 router.get("/:comment_id/edit",middleware.checkCommentsOwnership,function(req,res){
  Comment.findById(req.params.comment_id,function(err, foundComment) {
      if(err){
       res.redirect("back");       
      }else{
       res.render("comments/edit",{place_id:req.params.id,comment:foundComment});
       
      }
  });
 });
 
 

 
 //comments update route
 router.put("/:comment_id",middleware.checkCommentsOwnership,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
   if(err){
    res.redirect("back");
   }else{
    res.redirect("/places/"+req.params.id);
   }
  });
 });
 
 
 
//comments destroy route
 
 router.delete("/:comment_id",middleware.checkCommentsOwnership,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
   if(err){
    res.redirect("back");
   }else{
      req.flash("sucess","Comment deleted");
    res.redirect("/places/" + req.params.id);
   }
  });
 });
 
 //middleware
 
//  function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }




 
 
 module.exports = router;