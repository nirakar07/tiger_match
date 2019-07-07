var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var randomstring = require("randomstring");
const Profile = require("../models/profile");
const EmailService = require("../models/emailservice.js");

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
    var newUser = new User({username: req.body.username, verifyHash: randomstring.generate(32) });
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

//show verify form
router.get("/verify", function(req, res){
    if (req.query.token !== "") {
        
        if (req.query.token === req.user.verifyHash) {
            req.user.verified = true;
            console.log("Got a token match");
            req.flash('success', 'You were successfully verfified!');
            res.redirect("/profiles/new");
            req.user.save(function(err) {});
            return;
        }
        else {
            req.flash('error', 'Incorrect token');
        }
    }
    
    res.render("verify", {page: 'verify'});
    
});

router.post("/verify", function(req, res){
    if (typeof req.user === 'undefined') {
        req.flash('error', 'You are not signed in!');
    }
    else {
        EmailService.sendVerificationEmail(req, res);
    }
    res.redirect("/verify");
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
