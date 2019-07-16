var express = require("express");
var router = express.Router();
var passport = require("passport"),
    User = require("../models/user");

//getting signup form
router.get("/register", (req,res) => {
    res.render("register");
})

//handling the registeration logic
router.post("/register", (req,res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            console.log("Registered User :" + user.username);
            res.redirect("/campgrounds");
        })
    })
})

//Login Form
router.get("/login", (req,res) => {
    res.render("login");
})

//handling Login Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds", failureRedirect:"/login"
    }), (req,res) => {
})

//Logout Route
router.get("/logout", (req,res) => {
    req.logout();
    console.log("Logged Out");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
})

module.exports = router;