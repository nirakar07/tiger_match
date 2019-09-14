var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Profile  = require("./models/profile"),

    User        = require("./models/user"),
    session = require("express-session"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override");
// configure dotenv
// require('dotenv').load();

//requiring routes
var
    profileRoutes = require("./routes/profiles"),
    indexRoutes      = require("./routes/index");

// assign mongoose promise library and connect to database
// mongoose.Promise = global.Promise;

// const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/dineme';

// mongoose.connect(databaseUri, { useMongoClient: true })
//       .then(() => console.log(`Database connected`))
//       .catch(err => console.log(`Database connection error: ${err.message}`));

mongoose.connect("mongodb+srv://nirakar07:password@tigercluster-ge5an.mongodb.net/tigermatch?retryWrites=true");


var http = require('http');
var enforce = require('express-sslify');


// Use enforce.HTTPS({ trustProtoHeader: true }) in case you are behind
// a load balancer (e.g. Heroku). See further comments below
app.use(enforce.HTTPS({ trustProtoHeader: true }))
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/profiles", profileRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The DineMe Server Has Started!");
});
