var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Post       = require("../models/post"),
    Comment    = require("../models/comment"),
    User       = require("../models/user"),
    middleware = require("../middleware");

 // COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // console.log(req.params.id);
    // find campground by id
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: post}); 
        }
    });
});

// COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    var ID = "";
    var s = req.params.id;
    for(var x=0; x<s.length; x++){
    if(s[x]!=" "){
    ID+=s[x];}
}
    // console.log(req.params.id);
    //look up to campground using id
    Post.findById(ID, function(err, post){
        if(err){
            console.log(err);
            res.redirect("/posts");
        } else{
        
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else{
                    // add username and id to comment
                    comment.user.id = req.user._id;
                    comment.user.username = req.user.username; 
                    // save comment
                    comment.save();
                    
                    post.comments.push(comment);
                    post.save();
                    
                   
                    // redirect on show page of that campground
                    // '/posts/'+post._id
                    req.flash("success", "comment successfully added!");
                    res.redirect("back"); 
                    
                }
                
            });
            
        }
    });
});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    
        Post.findById(req.params.id, function(err, foundPost) {
            if(err || !foundPost){
                req.flash("error", "Campground not found!");
                res.redirect("back");
            }
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err){
                    req.flash("error", "Comment not found!");
                    res.redirect("back");
                }else{
                    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
        
    });
}); 

// update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    console.log(req.params.id);
    console.log(req.params.comment_id);
    
    var ID = "";
    var s = req.params.id;
    for(var x=0; x<s.length; x++){
    if(s[x]!=" "){
    ID+=s[x];}
}

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/posts/"+ID);
        }
    });
});

// Destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err, Post){
       if(err){
           res.redirect("back");
       } else{
           res.redirect("back");
       }
   }); 
});

// SHOW ALL COMMENTS
// router.get("/showComments", function(req, res){
//   res.render("comments/showComments"); 
// });


module.exports = router;
