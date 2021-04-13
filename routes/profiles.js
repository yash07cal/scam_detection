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
        if(err || !foundUser){
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

router.get("/profiles/:id/:post_id", function(req, res){
    Post.findById(req.params.post_id, function(err, foundPost){
        if(err || !foundPost || foundPost.user.id != req.params.id){
            req.flash("error", "Post not found!");
            console.log(err);
            res.redirect("back");
        } else{
               
                res.render("profiles/show", {campground: foundPost});
        }       
    });
});


module.exports = router;