var router = require('express').Router();

var AddCollege= require('../models/addcollege');



router.get('/add-college',function(req,res,next) {
    res.render('admin/add-college',{ message: req.flash("success") });
});


router.post('/add-college',function(req,res,next) {
    var addcollege = new AddCollege();
    addcollege.rname = req.body.rname;
    addcollege.desig=req.body.desig;
    addcollege.cname=req.body.cname;

    addcollege.save(function(err) {
        if(err) return next(err);
        req.flash("success","Successfully added a college");
        return res.redirect('/add-college');
    });
});


module.exports = router;