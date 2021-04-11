var middlewareObj = {},
    Post          = require("../models/post"),
    Comment       = require("../models/comment");


middlewareObj.checkCampgroundOwnership = function(req, res, next){

    if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
        if(err || !foundPost){
            req.flash("error", "Post not found!");
            res.redirect("back");
        } else{
           // does rthe user own the campground?
           if(foundPost.user.id.equals(req.user._id) || req.user.isAdmin){
                 next();
            }else{
                req.flash("error", "Permission Denied!");
                res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "Please login first!");
        res.redirect("back");
        }  
};

middlewareObj.checkCommentOwnership = function(req, res, next){
     if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            req.flash("error", "Comment not found!");
            res.redirect("back");
        } else{
                // does the user own the comment?
                if(foundComment.user.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error", "Permission Denied!");
                    res.redirect("back");
                }
        }
    });
    } else{
        req.flash("error", "Please login first!");
        res.redirect("back");
    }  
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
};

middlewareObj.isAdmin = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.isAdmin){
           return next(); 
        } else{
            req.flash("error", "permission denied!!")
            res.redirect("/posts");
        }
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}


module.exports = middlewareObj;