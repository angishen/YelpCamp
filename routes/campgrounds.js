var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

// INDEX route
router.get("/", function(req, res){
    // retrieve campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            // render campgrounds page from ejs
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW route
router.get("/new", function(req, res){
    res.render("campgrounds/new");
});

// CREATE route
router.post("/", function(req, res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //add new campground object to campground list
    var newCampground = {name: name, image: image, description: desc};
    // create a new campground and save to db
    Campground.create(newCampground, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            // redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });
    
});

// SHOW route
router.get("/:id", function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            // render the show template
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;