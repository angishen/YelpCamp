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
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Bridalveil Creek",
//         image: "https://www.nps.gov/yose/planyourvisit/images/IMG_6796edit.jpg?maxwidth=650&autorotate=false"
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


app.get("/campgrounds", function(req, res){
    // retrieve campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            // render campgrounds page from ejs
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.post("/campgrounds", function(req, res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    //add new campground object to campground list
    var newCampground = {name: name, image: image};
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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});