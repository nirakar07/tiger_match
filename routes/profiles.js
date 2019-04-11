var express = require("express");
var router  = express.Router();
var Profile = require("../models/profile");

var User = require("../models/user");
var middleware = require("../middleware");

var { isLoggedIn, checkUserProfile,  isAdmin, isSafe } = middleware; // destructuring assignment

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all profiles
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all profiles from DB
      Profile.find({name: regex}, function(err, allProfiles){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allProfiles);
         }
      });
  } else {
      // Get all profiles from DB
      Profile.find({}, function(err, allProfiles){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allProfiles);
            } else {
                var bool = false;
            //     Profile.findById().exec(function (err, story) {
            //   if (err) return console.log(err);
            //     if (story === null) bool = true;
            console.log(req.user);
              res.render("profiles/index",{profiles: allProfiles, page: 'profiles', user: req.user});
                // });
            }

         }
      });
  }
});
router.get("/thanks", function(req, res){
    res.render("thanks/index");
});

// CREATE - add new profile to DB
router.post("/", isLoggedIn, function(req, res){
  // get data from form and add to profiles array
  var q1 = req.body.q1;
  var q2 = req.body.q2;
  var q3 = req.body.q3;
  var q4 = req.body.q4;
  var q5 = req.body.q5;
  var q6 = req.body.q6;
  var q7 = req.body.q7;
  var author = req.user.username
  var newProfile = {q1: q1, q2: q2, q3: q3, q4: q4, q5: q5, q6: q6, q7: q7, author: author}
    // Create a new Profile and save to DB
    Profile.create(newProfile, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to profiles page
            console.log(newlyCreated);
            res.redirect("/profiles/thanks");
        }
  });
});


//NEW - show form to create new profile
router.get("/new", isLoggedIn, function(req, res){
   res.render("profiles/new");
});




// EDIT - shows edit form for a profile
router.get("/:id/edit", isLoggedIn, checkUserProfile, function(req, res){
  //render edit template with that profile
  res.render("profiles/edit", {profile: req.profile});
});



module.exports = router;
