// all middleware goes here
var middlewareObj = {};
var Campground    = require("../models/campground");
var Comment       = require("../models/comment");

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                req.flash("error", "You need to be logged in to do that.")
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that.")
                    res.redirect("back");
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
                req.flash("error", "Campground not found.")
                res.redirect("/");
            } else {
                if (foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that.")
                    res.redirect("back");
                }
                
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.")
    res.redirect("/login");
};

module.exports = middlewareObj;
