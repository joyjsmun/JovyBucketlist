var express = require("express");
var router = express.Router();
var Places = require("../models/places");

//index page
router.get("/",function(req,res){
   
    
   //get all places
   Places.find({},function(err,allPlaces){
      if(err){
         console.log(err);
      }else{
          res.render("places/index",{places:allPlaces,currentUser:req.user});
      }
   });
  
   
   
});

//create - create new place to DB
router.post("/",isLoggedIn, function(req,res){
  
   //get data form and add to places array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var author ={
      id : req.user._id,
      username: req.user.username
   }
   var newPlaces = {name:name,image:image,description:desc,author:author}
   

   
   // places.push(newPlaces);
   //creat new places for db
   Places.create(newPlaces,function(err,newlyCreated){
      if(err){
         console.log(err);
      }else{
         console.log(newlyCreated);
      res.redirect("/places");
         
      }
   })
   //redirect back to places
 
});


//new - show form to create new places
router.get("/new",isLoggedIn,function(req,res){
   res.render("places/new");
});

router.get("/:id",function(req,res){
   //find the place by id
   Places.findById(req.params.id).populate("comments").exec(function(err,foundPlace){
      if(err){
         console.log(err);
      }else{
         console.log(foundPlace);
            res.render("places/show",{place:foundPlace});
      }
   })
   //render show template 
   

});

 //middleware
 
 function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;