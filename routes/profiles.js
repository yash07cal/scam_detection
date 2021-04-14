var express       = require("express"),
    router        = express.Router(),
    User          = require("../models/user"),
    LocalStrategy = require("passport-local"),
    Post          = require("../models/post"),
    middleware    = require("../middleware"),
    multer        = require("multer"),
    passport      = require("passport");
    
router.use("/uploads", express.static("uploads"));

var storage = multer.diskStorage({
   destination: function(req, file, cb){
       cb(null,"./uploads/");
   },
   filename: function(req, file, cb){
       cb(null, new Date().toISOString() + file.originalname);
   }
});

var fileFilter = function(req, file, cb){
    // reject
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }else{
        cb(null, false);
    }
};

var upload  = multer({
storage: storage,
limits: {
    filesize: 1024 * 1024 * 5
},
fileFilter: fileFilter
});

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