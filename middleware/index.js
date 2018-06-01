// all middleware goes here
var middlewareObj = {};
var Campground    = require("../models/campground");
var Comment       = require("../models/comment");

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user.id)) {
                    next();
                }
            }
        });
    } else {
        res.redirect("/login");
    }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
     // check if user is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                if (foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
                
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;
