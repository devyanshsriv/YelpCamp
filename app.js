var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));

//Array of Campgrounds
var campgrounds = [
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60"},
    {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60"}
];

//Home Page
app.get('/', (req, res) => {
    res.render("landing");
})

//All Campgrounds Page
app.get('/campgrounds', (req, res) => {
    res.render("campgrounds", {campgrounds:campgrounds});
})

//Sending data to add new campground
app.post('/campgrounds', (req, res) => {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name, image:image}
    campgrounds.push(newCampground);
    
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
})

//Form to add new campground
app.get('/campgrounds/new', (req, res) => {
    res.render("newCampgroundForm");
})

app.listen(8000, function(){
    console.log("Server stared on port 8000");
})