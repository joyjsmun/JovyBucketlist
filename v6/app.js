var express = require("express"),
    app     = express(),
    request = require("request"),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   Places = require("./models/places"),
   Comment = require("./models/comment"),
   passport = require("passport"),
   LocalStrategy = require("passport-local"),
    User = require("./models/user"),   
   seedDB = require("./seeds")
   
   
   

mongoose.connect("mongodb://localhost/jovy_app_6");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");

 seedDB();

//Passport Configuration
app.use(require("express-session")({
    secret:"You can do it",
    resave:false,
    saveUninitialized :false
    
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser =req.user;
   next();
});


app.get("/",function(req,res){
   
   res.render("landing");
});


//index page
app.get("/places",function(req,res){
   
    
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
app.post("/places", function(req,res){
  
   //get data form and add to places array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newPlaces = {name:name,image:image,description:desc}
   // places.push(newPlaces);
   //creat new places for db
   Places.create(newPlaces,function(err,newlyCreated){
      if(err){
         console.log(err);
      }else{
      res.redirect("/places");
         
      }
   })
   //redirect back to places
 
});


//new - show form to create new places
app.get("/places/new",function(req,res){
   res.render("places/new");
});

app.get("/places/:id",function(req,res){
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


 //==================== comments Route
 
 app.get("/places/:id/comments/new/",isLoggedIn,function(req,res){
    //find places by ID
    Places.findById(req.params.id,function(err,place){
       if(err){
          console.log(err);
       }else{
          res.render("comments/new",{place:place})
       }
    })
    
 });
 
 
 app.post("/places/:id/comments",isLoggedIn,function(req,res){
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
                place.comments.push(comment._id);
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
 
 //=============
 //Auth Route
 //=============
  
 app.get("/register",function(req,res){
    res.render("register"); 
 });
 
 //handle signup logic
 app.post("/register",function(req, res) {
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
 app.get("/login",function(req,res){
    res.render("login"); 
 });

//handling login logic
//app.post("/login",middleware,callback)
app.post("/login",passport.authenticate("local",
        {
            successRedirect: "/places",
            failureRedirect: "/login"
        }), function(req,res){
   });


// Logic route

app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/places");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}




app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Jovy's Travel Bucket List Got Started~~ Hooray"); 
});


  // var places =    [
   //    {name: "Canada_Vancouver" , image: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"},
   //    {name: "Singapore" , image: "https://images.pexels.com/photos/358674/pexels-photo-358674.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"},
   //    {name: "Japan_Kyoto", image:"https://images.pexels.com/photos/161216/senso-ji-temple-kyoto-japan-161216.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"},
   //    {name: "Taiwan", image:"https://images.pexels.com/photos/260566/pexels-photo-260566.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"},
   //    {name: "USA_SanFrancisco", image:"https://images.pexels.com/photos/196642/pexels-photo-196642.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"},
   //    {name: "UAE_Dubai", image:"https://images.pexels.com/photos/417267/pexels-photo-417267.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"},
   //    {name: "Italy", image:"https://images.pexels.com/photos/158441/venice-italy-sunset-grand-canal-158441.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"},
   //    {name: "France_cheese", image:"https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?w=1260&h=750&auto=compress&cs=tinysrgb"},
   //    {name: "Spain_Tenelipe", image:"https://images.pexels.com/photos/52062/pexels-photo-52062.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"},
   //    {name: "Hawaii", image:"https://images.pexels.com/photos/416726/pexels-photo-416726.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"}
      
   // ];