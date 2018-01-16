var express = require("express");
var router = express.Router({mergeParams:true});
var Places = require("../models/places");
var Comment = require("../models/comment");


 
 router.get("/new",isLoggedIn,function(req,res){
    //find places by ID
    Places.findById(req.params.id,function(err,place){
       if(err){
          console.log(err);
       }else{
          res.render("comments/new",{place:place})
       }
    })
    
 });
 
 
 router.post("/",isLoggedIn,function(req,res){
    //lookup campgound using ID
    Places.findById(req.params.id,function(err, place) {
       if(err){
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
                place.comments.push(comment);
                place.save();
                res.redirect('/places/'+place._id);
                }
             });
             
        }
       
    });
    //create new comments
    //connect new comments to places
    //redirect place show page
 });
 
 //middleware
 
 function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



 
 
 module.exports = router;