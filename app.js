var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

var campgrounds = [
    { name: "Angel's Landing", image: "https://upload.wikimedia.org/wikipedia/commons/1/10/Zion_angels_landing_view.jpg"},
    { name: "Bridalveil Creek", image: "https://www.nps.gov/yose/planyourvisit/images/IMG_6796edit.jpg?maxwidth=650&autorotate=false"},
    { name: "Hetch Hetchy", image: "https://www.nps.gov/yose/planyourvisit/images/Pg_15_HetchHetchy_CreditClarisaFlores.jpg?maxwidth=1200&maxheight=1200&autorotate=false"}
];

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.post("/campgrounds", function(req, res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    //add new campground object to campground list
    var newCampground = {name: name, image: image}
    campgrounds.push(newCampground);
    //redirect to campgrounds page
    res.redirect("/campgrounds");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});