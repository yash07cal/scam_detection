var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    passport              = require("passport"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user"),
    Post                  = require("./models/post"),
    Comment               = require("./models/comment");
     
    
const uri = "mongodb+srv://yash_07cal:Yaku1234@scamdetection.tlgws.mongodb.net/scamDetection?retryWrites=true&w=majority";    

//REQUIRING ROUTES 
var commentRoutes     = require("./routes/comments"),
    postRoutes        = require("./routes/posts"),
    indexRoutes       = require("./routes/index"),
    profileRoutes     = require("./routes/profiles"),
    adminRoutes       = require("./routes/admin");

// mongoose.connect("mongodb://localhost/scam_detection",{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Yash1234@",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(flash());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/posts",postRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use(adminRoutes);
app.use(profileRoutes);

 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});