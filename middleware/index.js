var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

// all middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err || !foundCampground){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }else{
                //if logged in, does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Permission denied!!");
                    res.redirect("back");
                }       
            }
        })
    }else{
        console.log("Login first");
        req.flash("error", "You need to Login first");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err || !foundComment){
                req.flash("error", "Comment not found")
                res.redirect("back");
            }else{
                //if logged in, does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Permission denied!!");
                    res.redirect("back");
                }       
            }
        })
    }else{
        console.log("Login first");
        req.flash("error", "You need to Login first");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login first!");
    res.redirect("/login");
}

module.exports = middlewareObj;