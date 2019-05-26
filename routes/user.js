var router = require('express').Router();
var User = require('../models/user');
var Admin = require("../models/admin");
var College = require("../models/addcollege");
var rev = require("../models/collegereviews");
var passport = require('passport');




router.get('/adminlogin',function(req,res) {
    if (req.ad) return res.redirect('/');
    res.render('accounts/admin', { message: req.flash('loginMessage') });

});
router.post('/adminlogin', passport.authenticate('admin-local', {
    successRedirect: '/adminpage',
    failureRedirect: '/adminlogin',
    failureFlash: true
}));



router.get('/userclglist', function (req, res, next) {
    College.find({}, function (err, college) {
        if (err) return next(err);
        res.render('accounts/usercollegelist', { college: college});
    });
});


router.get('/userpostslist', function (req, res, next) {
    rev.find({}, function (err, creviews) {
        if (err) return next(err);
        res.render('accounts/userpostlist', { creviews: creviews });
    });
});


router.get('/clglist', function (req, res, next) {
    College.find({}, function (err, college) {
        if (err) return next(err);
        res.render('accounts/collegelist', { college: college, msg: req.flash('msg') });
    });
});

    router.get('/clglistrc/:_id', function (req, res, next) 
    {

    College.remove({ _id:req.params._id }, function (err) {
        if (err) return next(err);
        req.flash('msg', 'Successfully remove college');
        res.redirect('/clglist');
    });
});

router.get('/clglistac/:_id', function (req, res, next) {

    College.findById({ _id : req.params._id }, function (err, clg) {
        if (err) return next(err);
        if (clg) clg.flag = 1;
        clg.save(function (err) {
            if (err) return next(err);
            req.flash('msg', 'Successfully add college');
            res.redirect('/clglist');
        });
    });
});
















router.get('/adminpage', function (req, res, next) {
    Admin.findOne({ email:"admin@gmail.com"}, function (err,ad) {
        if (err) return next(err);
        res.render('accounts/adminpage', { ad: ad});
    });
});




router.get('/login',function(req,res) {
    if(req.user) return res.redirect('/');
    res.render('accounts/login', { message: req.flash('loginMessage')}); 
});

router.post('/login',passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile',function(req,res,next) {
    User.findById({ _id: req.user._id },function(err,user) {
        if(err) return next(err);
        res.render('accounts/profile',{user :user});
    });
});

router.get('/signup', function (req, res, next) {
    res.render('accounts/signup', {
        errors: req.flash('errors'),
        msg: req.flash('success') 

    });
});




router.post('/signup', (req, res) => {
    const { email, password, } = req.body;
    let errors = [];

    if (!email || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (errors.length > 0) {
        res.render('accounts/signup', {
            errors,
            email,
            password,
        });
    }
    else {
        var user = new User();
        var admin = new Admin();
        user.profile.username = req.body.username,
        user.email = req.body.email;
        user.password = req.body.password
        User.findOne({ email: req.body.email }, function (err, existinguser) {
            if (existinguser) {
                req.flash('msg', 'Account with that email already exists');
                return res.redirect('/signup');
            }
            else 
            {
                admin.save(function(error) {
                    if (!error) Admin.find({}).populate('stud');
                    user.save(function (err, user) {
                        if (err) return next(err);

                        req.logIn(user, function (err) {
                            if (err) return next(err);
                            return res.redirect('/profile');
                        });

                    });
                });
            }
        });
    }
});

router.get('/adminsignup', function (req, res, next) {
    res.render('accounts/adminsignup', {
        errors: req.flash('errors'),
        msg: req.flash('success')

    });
});


router.post('/adminsignup', (req, res) => {
    const { email, password, } = req.body;
    let errors = [];

    if (!email || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (errors.length > 0) {
        res.render('accounts/adminsignup', {
            errors,
            email,
            password,
        });
    }
    else 
    {
        var user = new Admin();
        user.email = req.body.email;
        user.password = req.body.password
        Admin.findOne({email: req.body.email},function(err,existinguser) {
            if(existinguser)
            {
                    req.flash('msg','Account with that email already exists');
                    return res.redirect('/adminsignup');
            }
            else
            {

                    user.save(function (err, user) {
                        if (err) return next(err);

                        req.logIn(user, function (err) {
                            if (err) return next(err);
                            return res.redirect('/adminpage');
                        });

                    });
            }
        });
    }
});



router.get('/logout',function(req,res,next) {
    req.logout();
    res.redirect('/');
});

router.get('/edit-profile',function(req,res,next) {
    res.render('accounts/edit-profile',{ message: req.flash('success')});
});

router.post('/edit-profile',function(req,res,next) {
    User.findOne({ _id: req.user._id }, function(err,user) {
        if(err) return next(err);
        if(req.body.name) user.profile.name = req.body.name;
        if(req.body.address) user.address = req.body.address;
        user.save(function(err) {
            if(err) return next(err);
            req.flash('success','Successfully Edited your profile');
            return res.redirect('/edit-profile');
        });
    });
});



module.exports = router;