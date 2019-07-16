var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local");

var User = require("./models/user"),
    seedsDB = require("./seeds");

var campgroundRoutes = require("./routes/campgroundRoutes"),
    commentRoutes = require("./routes/commentRoutes"),
    authRoutes = require("./routes/authRoutes");

// seedsDB(); 
mongoose.connect("mongodb+srv://devSriv22:dev1996@@localcluster-84ofl.mongodb.net/yelpcamp?retryWrites=true&w=majority", {useNewUrlParser: true});
app.set("view engine", "ejs");
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//=========================
//PASSPORT CONFIGURATION
//=========================

app.use(require("express-session")({
    secret: "My name is Devyansh",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

//Home Page
app.get('/', (req, res) => {
    res.render("landing");
})

app.listen(8000, function(){
    console.log("Server stared on port 8000");
})