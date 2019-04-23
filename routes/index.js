var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
//var randomstring = require("randomstring");
const Profile = require("../models/profile");

//root route
router.get("/", function(req, res){
    res.redirect("profiles");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'});
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, verifyHash: randomstring.generate(16) });
    // if(req.body.adminCode === process.env.ADMIN_CODE) {
    //   newUser.isAdmin = true;
    // }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/profiles/new");
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'});
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/profiles/new",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to TigerMatch!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/login");
});


module.exports = router;
