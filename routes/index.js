var express  = require("express"),
    router   = express.Router(),
    User     = require("../models/user"),
    passport = require("passport"),
    adminCode = "Admin";
// ROOT ROUTE
       
router.get("/", function(req, res){
    res.render("landing");
});

// =========================
// AUTHENTICATION ROUTES
// =========================


// REGISTER ROUTES

// show sign up form
router.get("/register", function(req, res){
    res.render("register");
});

// handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, name: req.body.name, email: req.body.email, location: {city: req.body.city, state: req.body.state}});
    if(req.body.adminCode === adminCode){
        newUser.isAdmin = true
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("/posts");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully registered!");
            res.redirect("/posts");
        });
    });
});

// LOGIN ROUTES

// RENDER LOGIN PAGE
router.get("/login", function(req, res){
    res.render("login");
});

// login logic
router.post("/login", 
    passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login"
    }), function(req ,res){
});
    
// logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/posts");
});

module.exports = router;