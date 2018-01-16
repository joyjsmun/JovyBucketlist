var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
   
   res.render("landing");
});

  
 router.get("/register",function(req,res){
    res.render("register"); 
 });
 
 //handle signup logic
 router.post("/register",function(req, res) {
     var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.redirect("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/places");
        });
    });
 });
 
 
 //show login form
 router.get("/login",function(req,res){
    res.render("login"); 
 });

//handling login logic
//app.post("/login",middleware,callback)
router.post("/login",passport.authenticate("local",
        {
            successRedirect: "/places",
            failureRedirect: "/login"
        }), function(req,res){
   });


// Logic route

router.get("/logout",function(req,res){
   req.logout();
   res.redirect("/places");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



 module.exports = router;