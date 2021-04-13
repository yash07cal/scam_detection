var express  = require("express"),
    router   = express.Router(),
    User     = require("../models/user"),
    passport = require("passport"),
    async    = require("async"),
    nodemailer = require("nodemailer"),
    crypto     = require("crypto");
    
// ROOT ROUTE
       
router.get("/", function(req, res){
    res.render("landing");
});

// =========================
// AUTHENTICATION ROUTES
// =========================


// REGISTER ROUTES

// show sign up form
router.get("/register", function(req, res){
    res.render("register");
});

// handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, name: req.body.name, email: req.body.email,city: req.body.city, state: req.body.state});
    if(req.body.adminCode === "Admin"){
        newUser.isAdmin = true
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully registered!");
            res.redirect("/posts");
        });
    });
});

// LOGIN ROUTES

// RENDER LOGIN PAGE
router.get("/login", function(req, res){
    res.render("login");
});

// login logic
router.post("/login", 
    passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login"
    }), function(req ,res){
});
    
// logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/posts");
});

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (err || !user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          type: 'OAuth2',
          user: 'fjune1581@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'fjune1581@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (err || !user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (err || !user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            if(err){
                req.flash("error", "Passwords do not match.");
                res.redirect("back");
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
                if(err){
                    console.log(err);
                }
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'fjune1581@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'fjune1581@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
      if(err){
          console.log(err);
          res.redirect("back");
      }
    res.redirect('/posts');
  });
});


module.exports = router;