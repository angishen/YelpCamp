var express    = require('express');
var router     = express.Router();
var passport   = require('passport');
var User       = require('../models/user');

// ROOTE ROUTE
router.get("/", function(req, res){
    res.render("landing");
});

// ============================
//          AUTH ROUTES
// ============================
// REGISTER ROUTE
router.get("/register", function(req, res){
    res.render("register");
});

// Handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if (err) {
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.username +"!");
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN ROUTE
router.get("/login", function(req, res){
    res.render("login");
});

// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Succesfully logged out.")
    res.redirect("/campgrounds");
});

module.exports = router;