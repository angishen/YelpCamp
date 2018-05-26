var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose');

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Bridalveil Creek",
//         image: "https://www.nps.gov/yose/planyourvisit/images/IMG_6796edit.jpg?maxwidth=650&autorotate=false",
//         description: "Cool campground in Yosemite National Park, California"
//     }, function(err, campground){
//         if (err){
//             console.log(err);
//         } else {
//             console.log("Newly created campground: ");
//             console.log(campground)
//         }
//     });

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX route
app.get("/campgrounds", function(req, res){
    // retrieve campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            // render campgrounds page from ejs
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW route
app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

// CREATE route
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/:id", function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            // render the show template
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});