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
   
   
   
   //requiring routes
   
   var commentsRoutes = require("./routes/comments"),
        placeRoutes = require("./routes/places"),
        indexRoutes = require("./routes/index")
   
   

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


app.use("/places/:id/comments/",commentsRoutes);
app.use("/",indexRoutes);
app.use("/places",placeRoutes);


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