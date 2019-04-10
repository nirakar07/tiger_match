
var Profile = require('../models/profile');


module.exports = {
 requireHTTPS: function(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}, 
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'You must be signed in to do that!');
      res.redirect('/login');
  },
  checkUserProfile: function(req, res, next){
    Profile.findById(req.params.id, function(err, foundEvent){
      if(err || !foundEvent){
          console.log(err);
          req.flash('error', 'Sorry, that event does not exist!');
          res.redirect('/profiles');
      } else if(foundEvent.author.id.equals(req.user._id) || req.user.isAdmin){
          req.profile = foundEvent;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/profiles/' + req.params.id);
      }
    });
  },
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'This site is now read only thanks to spam and trolls.');
      res.redirect('back');
    }
    }
}