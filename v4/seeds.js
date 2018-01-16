var mongoose = require("mongoose");
var Places = require("./models/places");
var Comment = require("./models/comment");
var data = [
                {
                    name:"San Francisco",
                    image :"https://images.pexels.com/photos/196642/pexels-photo-196642.jpeg?h=350&auto=compress&cs=tinysrgb",
                    description:"blah blah blash"
                },
                {
                    name:"Toronto",
                    image :"https://images.pexels.com/photos/6998/city-cityscape-amarpreet-kaur.jpg?h=350&auto=compress&cs=tinysrgb",
                    description:"blah blah blash"
                },
                {
                    name:"Singapore",
                    image :"https://images.pexels.com/photos/358674/pexels-photo-358674.jpeg?h=350&auto=compress&cs=tinysrgb",
                    description:"blah blah blash"
                }
    ]
    
function seedDB(){
    //Removed all places
    Places.remove({},function(err){
        if(err){
            console.log(err);
        }
       console.log("removed places"); 
            // add few places
            data.forEach(function(seed){
            Places.create(seed,function(err,place){
                if(err){
                    console.log(err);
                }else{
                    console.log("added places");
                    //create a comments
                    Comment.create(
                        {
                            text:"this is place is a great",
                            author:"jovy"
                    },function(err,comment){
                        if(err){
                            console.log(err);
                        }else{
                        place.comments.push(comment._id);
                        place.save();
                        console.log("created new commnets")
                        }
                    });
                    
                }
            });
        });
            
    });
    //add few comments
    
}

module.exports = seedDB;