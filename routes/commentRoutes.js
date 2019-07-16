var express = require("express");
var router = express.Router();

var Campground = require("../models/campgrounds"),
    Comment = require("../models/comments"),
    middleware = require("../middleware");

//Form to add new comments
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, (req, res) => {
    //find campground by Id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
        } else {
            res.render("Campgrounds/commentsForm", {campground:campground});
        }
    })
})

//Posting a new comment
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
    //lookup campground using the id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            //console.log(req.body.comment);
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                    req.flash("error", "Somethinf went wrong!!");
                }else{
                    //add username and id and then save comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    console.log("New comment :" + comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

//from to edit a comment
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req,res) =>{
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err || !foundCampground){
            res.flash("error", "No Campground found");
            return res.redirect("back");
        }else{
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if(err){
                    res.redirect("back");
                }else{
                    res.render("Campgrounds/editComment",{campground_id: req.params.id, comment: foundComment});
                }
            })
        }
    })
})

//updating the comment
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComments) => {
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res)=> {
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("back");
        }else{
            req.flash("Success", "Comment deleted successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;