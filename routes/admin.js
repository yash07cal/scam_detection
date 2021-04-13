var express       = require("express"),
    router        = express.Router(),
    User          = require("../models/user"),
    LocalStrategy = require("passport-local"),
    Post          = require("../models/post"),
    middleware    = require("../middleware"),
    passport      = require("passport");
    
router.get("/admin", middleware.isAdmin, function(req, res){
    Post.find({}, function(err, allPosts){
                if(err || !allPosts){
                    res.redirect("/posts");
                    console.log(err);
                    }else{
                        res.render("admin/admin", {campgrounds: allPosts});
                    }
            });
    });
    
router.post("/admin", middleware.isAdmin,function(req, res){
    var title = req.body.title;
    var image = req.body.image;
    var state = req.body.state;
    var city  = req.body.city
    var desc = req.body.description;
    var user = {
        id: req.user._id,
        username: req.user.username
    };
    var newPost = {title: title, image: image, state: state, city: city, description: desc, user: user};
    
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
                res.redirect("/posts");
            }
    });
});


router.get("/admin/:id", middleware.isAdmin, function(req, res) {
    Post.findById(req.params.id, function(err, foundPost){
        if(err || !foundPost ){
            req.flash("error", "Post not found!");
            console.log(err);
            res.redirect("back");
        } else{
               
                res.render("admin/show", {campground: foundPost});
        }       
    });
});

// router.get("/:id/", middleware.checkCampgroundOwnership, function(req, res){
   
//         Campground.findById(req.params.id, function(err, foundCampground){
//             if(err){
//                 req.flash("error", "Campground not found!");
//                 res.render("back");
//             }
//             res.render("campgrounds/edit", {campground: foundCampground});
                
//         });     
// });

router.put("/admin/:id", middleware.isAdmin, function(req, res){
    // find and update the corect camoground
    
    Post.findByIdAndUpdate(req.params.id, { isApproved: true }, function(err, updatedPost){
        if(err){
            console.log(err)
            res.redirect("back");
        } else{
            req.flash("success", "Post approved!!");
            res.redirect("/admin");
        }
    });
});

router.delete("/admin/:id", middleware.checkCampgroundOwnership, function(req, res){
   Post.findByIdAndRemove(req.params.id, function(err, post){
       if(err){
           res.redirect("/posts");
       } else{
           res.redirect("/admin")
       };
   }); 
});

module.exports = router;


