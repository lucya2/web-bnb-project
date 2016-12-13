var express = require('express'),
    User = require('../models/User');
    Room = require('../models/Room'); 
    Reservation = require('../models/Reservation');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  if (req.user) {
  } else {
      req.flash('danger', '로그인이 필요합니다.');
      return res.redirect('/signin');
  }
  User.findById(req.user, function(err, user) {
    if (err) {
      return next(err);
    }
    Room.findById(req.params.id, function(err, room) {
    if (err) {
      return next(err);
    }
    if(room.state === "예약가능"){
      res.render('reservations/index', {user: user , room: room});
    } else{
      req.flash('danger', '이미 예약중입니다');
      res.redirect('back');
    }
    });
  });  
});
router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('users/show', {user: user});
  });
});
router.get('/:id/reservestate', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    Reservation.find({requesterEmail: user.email},function(err,reservations) {
      if (err) {
        return next(err);
      }
    res.render('reservations/reservestate', {reservations: reservations});
    });
  });
});
router.get('/:id/manager', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    Room.find({email: user.email},function(err,rooms) {
      if (err) {
        return next(err);
      }
    res.render('reservations/manager', {rooms: rooms});
    });
  });
});
router.get('/:id/show', function(req, res, next) {
  Room.findById(req.params.id, function(err, room) {
    if (err) {
      return next(err);
    }
    Reservation.findOne({title: room.title},function(err, reservation) {
      if (err) {
        return next(err);
      }
      res.render('reservations/show', {reservation: reservation, room: room});
    });
  });
});
router.get('/:id/profile', function(req, res, next) {
  Reservation.findById(req.params.id, function(err, reservation) {
    if (err) {
      return next(err);
    }
    User.findOne({email: reservation.requesterEmail},function(err, user){
      if (err) {
        return next(err);
      }
      res.render('users/show', {user: user});
    });
  });
});
router.put('/:id/accept', function(req,res,next){
  Room.findById({_id: req.params.id}, function(err, room){
     if (err) {
      return next(err);
    }
    Reservation.findOne({title: room.title}, function(err, reservation){
      room.state ="예약완료";
      reservation.state = room.state;
      room.save(function(err) {
        if (err) {
          return next(err);
        }
        reservation.save(function(err) {
          if (err) {
            return next(err);
          }      
            req.flash('success', '예약을 수락 했습니다');
            res.redirect('back');
        });
      });
    });
  });
});
router.put('/:id/refuse', function(req,res,next){
  Room.findById({_id: req.params.id}, function(err, room){
     if (err) {
      return next(err);
    }
    Reservation.findOneAndRemove({title: room.title}, function(err, reservation){
      room.state ="예약가능";
      reservation.state = room.state;
      room.save(function(err) {
        if (err) {
          return next(err);
        }
        reservation.save(function(err) {
          if (err) {
            return next(err);
          }
          req.flash('success', '예약을 거절 했습니다');
          res.redirect('back');
        });
      });
    });
  });
});
router.post('/:id', function(req, res, next) {
  Room.findById(req.params.id, function(err, room) {
    if (err) {
      return next(err);
    }
    User.findOne({email: req.body.requesterEmail}, function(err, user){
      if (err) {
        return next(err);
      }
      if(room.capacity < req.body.capacity){
        req.flash('danger', '최대 인원을 넘었습니다.');
        return res.redirect('back');
      }
      room.state = "예약진행중";
      room.save(function(err) {
        if (err) {
          return next(err);
        }
      });
      var newReservation = new Reservation({
        requesterEmail: req.body.requesterEmail,
        hostEmail: req.body.hostEmail,
        name: req.body.name,
        title: room.title,
        state: room.state,
        bigAddress: user.bigAddress + user.smallAddress,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        capacity: req.body.capacity,
      });
      newReservation.save(function(err) {
        if (err) {
          return next(err);
        } else {
          req.flash('success', '숙소 예약 신청을 했습니다.');
          res.redirect('/rooms/lists');
        }
      });
    });
  });
});

module.exports = router;