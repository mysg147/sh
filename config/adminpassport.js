var passport = require('passport');
var CustomStrategy = require('passport-custom').Strategy;
var Admin = require('../models/admin');
// Serialize and deserialize
passport.serializeUser(function (user, done) {
    done(null, user._id);

});

passport.deserializeUser(function (id, done) {
    Admin.findById(id, function (err, user) {
        done(err, user);
    });
});


passport.use('admin-local',new CustomStrategy(
    function (req, done) {
        Admin.findOne({email: req.body.email}, function (err, user) {
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user has been found'));
            }
            if(!user.comparePassword(req.body.password)) {
                return done(null, false, req.flash('loginMessage', 'Oops Wrong Password'));
            }
            done(err, user);
        });
}));


exports.isAuthenticated1 = function (req, res, next) {
    if (req.isAuthenticated1()) {
        return next();
    }
    res.redirect('/adminlogin');
}