var express       = require("express"),
    router        = express.Router(),
    User          = require("../models/user"),
    LocalStrategy = require("passport-local"),
    Post          = require("../models/post"),
    middleware    = require("../middleware"),
    passport      = require("passport");
    
    

// Routes
router.get("/profiles/:id", middleware.isLoggedIn, function(req, res){
    console.log()
    User.findById(req.params.id, function(err, foundUser){
        if(err){
             res.redirect("back");
        } else{
            Post.find({}, function(err, posts){
                if(err || !posts){
                    res.render("profiles/profiles");
                }else{
                    res.render("profiles/profiles", {foundUser: foundUser, posts: posts});
                }
            })
             
            }
        });
    });


module.exports = router;