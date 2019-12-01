var express = require("express");
var router = express.Router();
var Neusualnetwork = require("../models/neusualnetwork");
var middleware = require("../middleware");
router.get("/", function(req,res){
        Neusualnetwork.find({},function(err,allNeusualnetworks){
            if(err){
                console.log(err);
            }else{
                res.render("neusualnetworks/neusualhome",{neusualnetworks:allNeusualnetworks});    
            }
        });
});
//CREATE ADD NEW CAMPGROUND
router.post("/",middleware.isLoggedIn, function(req,res){
   var newneunet = req.body.addnew;
   var price = req.body.price;
   var image = req.body.image;
   var description = req.body.description;
   var author = {
       id:req.user._id,
       username:req.user.username
   };
   var newNeusualnetwork = {name:newneunet , price:price, image:image, description:description, author:author};
   //create new neusualnetwork and save to DB
   Neusualnetwork.create(newNeusualnetwork, function(err,newlyCreated){
       if(err){
           console.log(err);
       }else{
           console.log(newlyCreated);
           res.redirect("/neusualhome");
       }
   });
});
//NEW  - show form to create new neusualnetwork
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("neusualnetworks/new");
});
router.get("/test", middleware.isLoggedIn, function(req, res) {
    res.render("/neusualhome");
});
//SHOW more info about one neusualnetwork
router.get("/:id", function(req, res) {
    Neusualnetwork.findById(req.params.id).populate("comments").exec(function(err,showNeusualnetwork){
        if(err){
            console.log(err);
        }else{
            //render show template with that neusualnetwork
            console.log(showNeusualnetwork);
            //res.json(showneusualnetwork);
            res.render("neusualnetworks/show",{neusualnetwork:showNeusualnetwork});
        }
    });
});
//EDIT Neusualnetwork Route
router.get("/:id/edit", middleware.checkNeusualnetworkOwnership, function(req, res) { // middleware is called before we go to route handler
        Neusualnetwork.findById(req.params.id, function(err,foundNeusualnetwork){
                if(err){
                    console.log(err);
                }else{
                res.render("neusualnetworks/edit",{neusualnetwork: foundNeusualnetwork}); 
                }
        });
    //otherwise redirect
    //if not redirect
});

//UPDATE Neusualnetwork route
router.put("/:id",middleware.checkNeusualnetworkOwnership, function(req, res) {
    
    //find and update the correct neusualnetwork
    Neusualnetwork.findByIdAndUpdate(req.params.id, req.body.neusualnetwork, function(err, updatedNeusualnetwork) {
        if(err){
            res.redirect("/neusualhome");
        }else{
            res.redirect("/neusualhome/" + req.params.id); // instead of req.params.id , can also be done updatedNeusualnetwork._id 
        }   
    });
    //redirect somewhere(show page)
})
//DESTROY Neusualnetwork Route
router.delete("/:id",middleware.checkNeusualnetworkOwnership, function(req,res){   // actaul destroy route -> neusualnetworks/:id
    Neusualnetwork.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/neusualhome");
        }else{
            res.redirect("/neusualhome");
        }
    })
})

module.exports = router;