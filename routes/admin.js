var express       = require("express"),
    router        = express.Router(),
    User          = require("../models/user"),
    LocalStrategy = require("passport-local"),
    Post          = require("../models/post"),
    middleware    = require("../middleware"),
    passport      = require("passport");



// get route
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
// =========================================================================================



// show page
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


