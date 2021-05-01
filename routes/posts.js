var express    = require("express"),
    router     = express.Router(),
    Post       = require("../models/post"),
    User       = require("../models/user"),
    multer     = require("multer"),
    brain      = require('brain.js'),
    Sentiment  = require('sentiment'),
    middleware = require("../middleware");
    

const data = require('../dataSet.json');

const network = new brain.recurrent.LSTM();

const trainingData = data.map(item => ({
  input: item.title,
  output: item.category
}));

network.train(trainingData, {
    iterations: 300
});

const run = network.toFunction();

 
var sent = new Sentiment();

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter, limits: {filesize: 1024 * 1024 * 5}});

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'scamdetection', 
  api_key: process.env.APIKEY, 
  api_secret: process.env.APISECRET
});
  

//==================================================================================================================================================================== 
//INDEX ROUTE 
router.get("/", function(req, res){
    
    
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
         Post.find({"state": regex}, function(err, allPosts){
                if(err){
                    console.log();
                    console.log(err);
                    }else{
                        
                        res.render("posts/index", {campgrounds: allPosts,  run: run, sent: sent});
                    }
            });
    } else{
         // GET ALL CAMPGROUNDS FROM DB
            Post.find({}, function(err, allPosts){
                if(err){
                        console.log(err);
                    }else{
                        res.render("posts/index", {campgrounds: allPosts, sent: sent, });
                    }
            });
    }
    
});


//==================================================================================================================================================================== 

// ADD NEW CAMPGROUNDS
router.get("/new",middleware.isLoggedIn, function(req, res) {
    res.render("posts/new");
});

//post route 
router.post("/", middleware.isLoggedIn, upload.single("imgdevice"), function(req, res, next){
    var title = req.body.title;
    var image = req.body.image;
    var user = {
        id: req.user._id,
        username: req.user.username
    };
    var state = req.body.state;
    var city  = req.body.city
    var desc = req.body.description;
    var created = Date.now();
    if(!req.file){
        var newPost = {title: title, image: image, state: state, city: city, description: desc, user: user, created: created};
        Post.create(newPost, function(err, newlyCreated){
            if(err){
                console.log(err);
                req.flash("error", err.message)
                res.redirect("back");
            } else{
                req.flash("success", "Post successfully added for review, it'll be featured on home page once reviewed!!")
                res.redirect("/posts");
                }
        });
    } else{
        cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
            if(err){
                console.log(err);
            } else{
                 image = result.secure_url;
                  var newPost = {title: title, image: image, state: state, city: city, description: desc, user: user, created: created};
                    Post.create(newPost, function(err, newlyCreated){
                        if(err){
                            console.log(err);
                            req.flash("error", err.message)
                            res.redirect("back");
                        } else{
                            req.flash("success", "Post successfully added for review, it'll be featured on home page once reviewed!!")
                            res.redirect("/posts");
                            }
                    });
                }
            });
        }
    });


//==================================================================================================================================================================== 

// SHOW 
router.get("/:id", function(req, res) {
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err || !foundPost ){
            req.flash("error", "Post not found!");
            console.log(err);
            res.redirect("back");
        } else{
            var x=0, n=0;
            foundPost.comments.forEach(function(comment){
               var s = (sent.analyze(comment.text));
               if(s.comparative >0){
                    x+= 1;
               }else{
                   n+= -1;
               }
            });
            var com = foundPost.comments.length;
            var feedback = ((x + n)/com).toFixed(1);;
            res.render("posts/show", {campground: foundPost, feedback: feedback});
        }       
    });
});

router.get("/category/world", function(req, res) {
    
    Post.find({}, function(err, allPosts){
                if(err){
                        console.log(err);
                    }else{
                        res.render("posts/world", {campgrounds: allPosts, network: network});
                        
                    }
            });
});

router.get("/category/sports", function(req, res) {
    
    Post.find({}, function(err, allPosts){
                if(err){
                        console.log(err);
                    }else{
                        res.render("posts/sports", {campgrounds: allPosts, network: network});
                        
                    }
            });
});

router.get("/category/india", function(req, res) {
    
    Post.find({}, function(err, allPosts){
                if(err){
                        console.log(err);
                    }else{
                        res.render("posts/india", {campgrounds: allPosts, network: network});
                        
                    }
            });
});



//==================================================================================================================================================================== 

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
   
        Post.findById(req.params.id, function(err, foundPost){
            if(err){
                req.flash("error", "Post not found!");
                res.render("back");
            }
            res.render("posts/edit", {campground: foundPost});
                
        });     
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, upload.single("imgdevice"), function(req, res){
    // find and update the corect camoground
    if(!req.file){
        Post.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedPost){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Post successfully updated!");
            res.redirect("/posts/"+ req.params.id);
        }
    });
    }else{
        cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                if(err){
                    console.log(err);
                } else{
                    req.body.campground.image = result.secure_url;
                     Post.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedPost){
                        if(err){
                            res.redirect("back");
                        } else{
                            req.flash("success", "Post successfully updated!");
                            res.redirect("/posts/"+ req.params.id);
                        }
                    });
                }
            });
        }
    
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