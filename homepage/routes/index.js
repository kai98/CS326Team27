var express = require("express");
var router = express.Router(); 
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

//root route
router.get("/", function(req,res){
    res.render("landing");
});


// ==================
// AUTH ROUTES
// ==================

// show register form
router.get("/register", function(req, res) {
    res.render("register");
})

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err)   
        {
            return res.render("register",{"error":err.message});// err.message is internally generated message
        }
            passport.authenticate("local")(req,res, function(){
                req.flash("success","Welcome to NEUSUAL " + req.body.username +" >_< ");  // req.body.username <=> user.username
                res.redirect("/neusualhome");
        });
    });
});

//show login
router.get("/login", function(req, res) {
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect : "/neusualhome",
    failureRedirect : "/login"
}), function(req, res){
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/neusualhome");
});


module.exports = router;