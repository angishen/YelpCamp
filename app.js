var express                 = require('express'),
    app                     = express(),
    bodyParser              = require('body-parser'),
    mongoose                = require('mongoose'),
    passport                = require('passport'),
    LocalStrategy           = require('passport-local'),
    Campground              = require('./models/campground'),
    Comment                 = require('./models/comment'),
    User                    = require('./models/user'),
    seedDB                  = require("./seeds.js");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "This is a secret!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW route
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
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
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            // render the show template
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// ===========================
//       COMMENTS ROUTES
// ===========================

// NEW ROUTE
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

// AUTH ROUTES
// REGISTER
app.get("/register", function(req, res){
    res.render("register");
});

// Handle signup logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN
app.get("/login", function(req, res){
    res.render("login");
})

// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// LOGOUT
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
    
});