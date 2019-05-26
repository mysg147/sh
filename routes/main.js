var router = require('express').Router();
var User = require('../models/user');

var AddCollege = require('../models/addcollege');
var CollegeReviews = require('../models/collegereviews');

CollegeReviews.createMapping(function(err,mapping) {
    if(err)
    {
        console.log("error creating mapping");
        console.log(err);
    } else {
        console.log("Mapping created");
        console.log(mapping);
    }

});


var stream = CollegeReviews.synchronize();
var count = 0;

stream.on('data',function() {
    count++;
});

stream.on('close',function() {
    console.log("Indexed "+ count +"documents");
});

stream.on('error',function(err) {
    console.log(err);
});

router.post('/search',function(req,res,next) {
    res.redirect('/search?q=' + req.body.q);
});

router.get('/search',function(req,res,next) {
    if(req.query.q) {
        CollegeReviews.search({
            query_string: {query:req.query.q}
        },function(err,results) {
            results:
        if(err)return next(err);
        var data=results.hits.hits.map(function(hit){
            return hit;
        });
        res.render('main/search-result',{
            query:req.query.q,
            data
        });

    });
}
});



router.get('/', function (req, res, next) {
    CollegeReviews.find({},function (err,creviews) {
        if (err) return next(err);
        res.render('main/home' ,{creviews:creviews});
    });
});

router.get('/posts/:_id',function(req,res,next) {
    CollegeReviews.findById({ "_id": req.params._id}, function (err,creviews) {
            if (err) return next(err);
            res.render('main/posts', { creviews:creviews });
        });
}); 











router.get('/about', function (req, res) {
    res.render('main/about');
});


router.get('/collegereviews/:cname', function (req, res,next) {
        AddCollege.findOne({cname:req.params.cname},function(err,college) {
        
            if (err) return next(err);
            res.render('main/collegereviews', {college:college });
        });
    
});

router.post('/collegereviews/:cname', function (req, res, next) {
        AddCollege.findOne({ cname:req.params.cname },function(err,clg) {

            if(err) return next(err);

            var cr = new CollegeReviews();
            cr.collegename=clg.cname;
            cr.username=req.body.username;
            cr.rtitle=req.body.rtitle;
            cr.content=req.body.content;
            cr.year=req.body.year;
            cr.branch=req.body.branch;
            cr.save(function (err,cr) 
            {
                if (err) return next(err);
                req.flash("success", "Thanks for posting a review");
                return res.redirect('/');
            });
        });
    });

router.get('/posts',function(req,res) {
    res.render('main/posts');
});


router.get('/contact',function(req,res) {
    res.render('main/contact');
});


router.get('/reviewslist', function (req, res, next) {
    CollegeReviews.find({}, function (err,creviews) {
        if (err) return next(err);
        res.render('accounts/reviewslist', { creviews: creviews, msg: req.flash('msg') });
    });
});


router.get('/userpostlist/:_id', function (req, res, next) {

    CollegeReviews.remove({ _id: req.params._id }, function (err, next) {
        if (err) return next(err);
        req.flash('msg', 'Successfully remove posts');
        res.redirect('/userpostslist');
    });
});

router.get('/clglistrp/:_id', function (req, res, next) {

    CollegeReviews.remove({ _id : req.params._id }, function (err, next) {
        if (err) return next(err);
        req.flash('msg', 'Successfully remove posts');
        res.redirect('/reviewslist');
    });
});




router.get('/clglistap/:_id/:collegename', function (req, res, next) {

    CollegeReviews.findOne({ collegename: req.params.collegename }, function (err, c) {
        if (err) return next(err);
        if (c) c.flag = 1;
        c.save(function (err) {
            if (err) return next(err);
            req.flash('msg', 'Successfully add reviews');
            res.redirect('/reviewslist');
        });
    });
});


router.get('/like/:_id',function(req,res,next) {
    CollegeReviews.findById({ _id : req.params._id }, function (err, c) {
        if (err) return next(err);
        if (c) c.like = c.like+1;
        c.save(function (err) {
            if (err) return next(err);
            res.redirect('/profile');
        });
    });

});



router.get('/dislike/:_id', function (req, res, next) {
    CollegeReviews.findById({ _id: req.params._id }, function (err, c) {
        if (err) return next(err);
        if (c) c.dislike=c.dislike+1;
        c.save(function (err) {
            if (err) return next(err);
            res.redirect('/profile');
        });
    });

});

module.exports = router;