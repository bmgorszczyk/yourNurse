const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Nurse = require('../models/nurse');
const Event = require('../models/event');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const path = require('path');

// ----- AUTH ROUTE -------//

router.post('/api/authenticate', function(req, res) {
	User.findOne({
	    login: req.body.login
	}, function(err, user) {
		if (err) {
		  res.send({error: err});
		}

		if (!user) {
			res.send({ success: false, message: 'Nie ma takiego użytkownika!' });
		} else {

            if(bcrypt.compareSync(req.body.password, user.get('password'))){

				const token = jwt.sign({
					id: user.get('_id'),
					login: user.get('login')
				}, 'MYSECRET', { algorithm: 'HS256' });
				res.send({
					success: true,
					token: token
				});
            } else {
				res.send({
					success: false,
					message: 'Nieprawidłowe hasło!'
				});
			}
		}
	});
});

// ----- NURSES ROUTES ----- //

router.get('/api/nurses', authentication, function(req, res, next){
  Nurse.find({}, function (err, nurse) {
      res.send(nurse);
  });
});

router.get('/api/nurses/:id', authentication, function(req, res, next){
  Nurse.findOne({_id: req.params.id}, function (err, nurse) {
      res.send(nurse);
  }).catch(function(){
	  res.status(400).send();
  });
});

router.post('/api/nurses', authentication, function(req, res, next){
  Nurse.create(req.body).then(function(nurse){
    res.send(nurse);
  }).catch(next);
});

router.put('/api/nurses/:id', authentication, function(req, res, next){
  Nurse.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(nurse){
  	res.send(nurse);
	});
});

router.delete('/api/nurses/:id', authentication, function(req, res, next){
  Nurse.findByIdAndRemove({_id: req.params.id}).then(function(){
    Event.find({nurseID: req.params.id}).remove().exec(function(){
      Nurse.find({}, function (err, nurse) {
  		  res.send(nurse);
  	  });
    });
  });
});

// ----- EVENTS ROUTES ----- //

router.get('/api/events', authentication, function(req, res, next){
  Event.find({}, function (err, event) {
      res.send(event);
  });
});

router.get('/api/events/:monthYear', authentication, function(req, res, next){
	Event.find({
	  monthYear: req.params.monthYear
    }, function (err, event) {
		res.send(event);
	});
});

router.get('/api/events/:id', authentication, function(req, res, next){
  Event.findOne({_id: req.params.id}, function (err, event) {
      res.send(event);
  });
});

router.get('/api/normatives/:monthYear', authentication, function(req, res, next){
  Event.aggregate([
    {
      $match: {
        "monthYear": req.params.monthYear
      }
    },
    {
  		$group: {
			_id: "$nurseID",
			"hours": {$sum: "$shiftTime"},
			count: {$sum: 1}
		}
    }
    ], function (err, hours) {
    	res.send(hours);
	});

});

router.post('/api/events', authentication, function(req, res, next){

  Event.findOne({
    nurseID: req.body.nurseID,
    start: req.body.start
  }, function(err, result) {
    if(err) {
        console.log(err);
    }
    if(!result){
      Event.create(req.body).then(function(event){
        res.send({
          event: event,
          success: true
        });
      }).catch(next);
    } else {
      res.send({
        success: false,
        message: 'Ta pielegniarka ma juz przypisany dyzur w tym dniu!'
      })
    }
  });
});

router.put('/api/events/:id', authentication, function(req, res, next){
  Event.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    Event.findOne({_id: req.params.id}).then(function(event){
      res.send(event);
    })
  });
});

router.delete('/api/events/:id', authentication, function(req, res, next){
  Event.findByIdAndRemove({_id: req.params.id}).then(function(){
	  Event.find({}, function (err, event) {
		  res.send(event);
	  });
  });
});

process.env.PWD = process.cwd();
router.get('*', function (req, res) {
   res.sendFile(path.join(process.env.PWD, 'client/build/index.html'));
 })

function authentication(req, res, next) {
	if (!req.headers['authorization']) {
		return res.json({status: 500, error: err});
		res.end();
	} else {
		var token = req.headers['authorization'];
		return jwt.verify(token, 'MYSECRET', function(err, result) {
			if (err) {
				return res.send(err);
				res.end();

			}
			return next();
		});
	}

}

module.exports = router;
