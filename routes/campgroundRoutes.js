var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds"),
    middleware = require("../middleware");

//All Campgrounds Page
router.get('/campgrounds', (req, res) => {
    console.log(req.user)
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    })
})

//Sending data to create new campground
router.post('/campgrounds', middleware.isLoggedIn, (req, res) => {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name, image:image, description:description, author: author}
    //create a new campground and save to db
    Campground.create(newCampground, function(err, campgroundAdded){
        if(err){
            console.log(err);
        }else{
            //redirect back to campgrounds page
            console.log("Newly added Campground :" +campgroundAdded);
            res.redirect("/campgrounds");
        }
    })
})

//Form to add new campground
router.get('/campgrounds/new',middleware.isLoggedIn, (req, res) => {
    res.render("Campgrounds/newCampgroundForm");
})

//Show only the selected campground
router.get('/campgrounds/:id', (req,res) =>{
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground not found");
            res.redirect("back");
        }else{
            console.log(foundCampground);
            res.render("campgrounds/show", {campground:foundCampground});
        }
    })
})

//EDIT CAMPGROUND
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
        Campground.findById(req.params.id, (err, foundCampground) => {
            res.render("campgrounds/editCampground", {campground: foundCampground});
    })
})

//update the campground
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, (req,res) =>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) =>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//Delete campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, (req,res)=>{
    Campground.findByIdAndRemove(req.params.id, (err) =>{
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;