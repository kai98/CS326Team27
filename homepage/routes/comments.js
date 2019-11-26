var express = require("express");
var router = express.Router({mergeParams:true}); //merge params from neusualnetwork and comments together so that inside comments we can access :id .

var Neusualnetwork = require("../models/neusualnetwork");
var Comment =require("../models/comment");
var middleware =require("../middleware");
// ==================
//COMMENTS ROUTES
//===================
// comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find neusualnetwork by id
    Neusualnetwork.findById(req.params.id, function(err, neusualnetwork){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{neusualnetwork:neusualnetwork});
        }
    });
});

//Comments create
router.post("/", middleware.isLoggedIn, function(req,res){
    //lookup neusualnetwork using id
    Neusualnetwork.findById(req.params.id, function(err, neusualnetwork) {
        if(err){
            console.log(err);
            res.redirect("/neusualhome");
        }else{
            //create new comment
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    req.flash("error","something went wrong");
                    console.log(err);
                    res.redirect("/neusualhome");
                }else{
                    // add username and id to comment
                    // save comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log("New comment's username will be: " + req.user.username);
                    //connect new comment to neusualnetwork
                    neusualnetwork.comments.push(comment);
                    neusualnetwork.save();
                    req.flash("success","Successfully added comment");
                    //redirect to neusualnetwork show page
                    res.redirect("/neusualhome/" + neusualnetwork._id);
                }
            })
        }
    })
})
// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){  // actually route is /neusualhome/:id/comments/:comment_id/edit
   Comment.findById(req.params.comment_id, function(err,foundComment){
       if(err){
           res.redirect("back");
       }else{
            res.render("comments/edit",{neusualnetwork_id : req.params.id, comment:foundComment}); 
       }
   });
});
//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/neusualhome/" + req.params.id);
       }
   });
});
//COMMENT DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){  // actual destroy route -> /neusualhome/:id/comments/:comment_id
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment deleted successfully");
            res.redirect("/neusualhome/" + req.params.id);
        }
    })
})  


module.exports = router;