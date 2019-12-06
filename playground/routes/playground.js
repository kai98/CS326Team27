var express = require("express");
var router = express.Router(); 
var middleware = require("../../homepage/middleware");

router.get("/", middleware.isLoggedIn, function(req, res) {
    res.render("playground/index");
});

module.exports = router;