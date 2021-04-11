var express    = require("express"),
    router     = express.Router(),
    Post       = require("../models/post"),
    User       = require("../models/user"),
    middleware = require("../middleware");
    
    
//INDEX ROUTE 
router.get("/", function(req, res){
    console.log(req.query);
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
         Post.find({"title": regex}, function(err, allPosts){
                if(err){
                        console.log(err);
                    }else{
                         res.render("posts/index", {campgrounds: allPosts});
                    }
            });
    } else{
         // GET ALL CAMPGROUNDS FROM DB
            Post.find({}, function(err, allPosts){
                if(err){
                        console.log(err);
                    }else{
                         res.render("posts/index", {campgrounds: allPosts});
                    }
            });
    }
    
   
});


// ADD NEW CAMPGROUNDS
router.get("/new",middleware.isLoggedIn, function(req, res) {
    res.render("posts/new");
});
 


// SHOW 
router.get("/:id", function(req, res) {
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err || !foundPost ){
            req.flash("error", "Post not found!");
            console.log(err);
            res.redirect("back");
        } else{
               
                res.render("posts/show", {campground: foundPost});
        }       
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
   
        Post.findById(req.params.id, function(err, foundPost){
            if(err){
                req.flash("error", "Campground not found!");
                res.render("back");
            }
            res.render("posts/edit", {campground: foundPost});
                
        });     
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the corect camoground
    
    Post.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedPost){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Post successfully updated!");
            res.redirect("/posts/"+ req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Post.findByIdAndRemove(req.params.id, function(err, Post){
       if(err){
           res.redirect("/posts");
       } else{
           res.redirect("/posts")
       };
   }); 
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;