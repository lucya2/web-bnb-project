var express = require('express'),
    User = require('../models/User');
    Room = require('../models/Room');
    Ccomment = require('../models/Ccomment');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    return res.redirect('/signin');
  }
}
router.get('/lists/', function(req, res, next) {
  Room.find({}, function(err, rooms) {
    if (err) {
      return next(err);
    }
    res.render('rooms/index', {rooms: rooms});
  });
});
router.get('/hosting', needAuth, function(req, res, next) {
    res.render('rooms/hosting');
});
router.get('/ix', needAuth, function(req, res, next) {
    res.render('rooms/ix');
});
router.get('/:id/new', function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return next(err);
        }
        res.render('rooms/new', {user: user});
    }); 
});
router.get('/:id/profile', function(req, res, next) {
  Room.findById(req.params.id, function(err, room) {
    if (err) {
      return next(err);
    }
    User.findOne({email: room.email},function(err, user){
      if (err) {
        return next(err);
      }
      res.render('users/show', {user: user});
    });
  });
});
router.get('/:id/edit', function(req, res, next) {
    Room.findById(req.params.id, function(err, room) {
        if (err) {
            return next(err);
        }
        res.render('rooms/edit', {room: room});
    }); 
});
router.get('/:id', function (req, res, next) {
    Room.findById(req.params.id, function (err, room) {
        if (err) {
            return next(err);
        }
        room.read = room.read + 1;
        room.save(function(err){
            if(err){
                return next(err);
            }    
        });
        Ccomment.find({title: room.title}, function(err,ccomments){
            if(err){
                return next(err);
            }    
            res.render('rooms/show', { room: room, ccomments: ccomments }); 
          });
    });
});
router.get('/:id/host', function (req, res, next) {
    Reservation.findById(req.params.id, function (err, reservation) {
        if (err) {
            return next(err);
        }
        Room.findOne({email: reservation.hostEmail}, function (err, room){
          room.read = room.read + 1;
          room.save(function(err){
            if(err){
                return next(err);
            }    
          });
          Ccomment.find({title: room.title}, function(err,ccomments){
            if(err){
                return next(err);
            }    
            res.render('rooms/show', { room: room, ccomments: ccomments }); 
          });
        });
    });
});
router.post('/:id/ccomment', needAuth, function(req, res, next) {
  Room.findById(req.params.id, function(err, room){
    if (err) {
      return next(err);
    }
    if(!req.body.content){
      req.flash('danger', '댓글을 입력해주세요.'); 
      return res.redirect('back'); 
    }
    var newCcomment = new Ccomment({
      name: req.user.name,
      email: req.user.email,
      title: room.title,
      content: req.body.content
    });
    newCcomment.save(function(err) {
      if (err) {
        return next(err);
      }
    });
    Ccomment.find({title: room.title}, function(err,ccomments){
      if (err) {
        return next(err);
      }
      req.flash('success', '등록되었습니다.'); 
      res.redirect('back');  
    });
  });
});
router.post('/search', function(req, res, next) {
    Room.find({city: req.body.search}, function(err, rooms){
        if (err) {
            return next(err);
        }
        res.render('rooms/index', {rooms: rooms});
    });
});
router.post('/', function(req, res, next) {
  Room.findOne({title: req.body.title}, function(err, room) {
    if (err) {
      return next(err);
    }
    if (room) {
      req.flash('danger', '동일한 방이름이 있습니다.');
      return res.redirect('back');
    }
    var newRoom = new Room({
      email: req.body.email,
      capacity: req.body.capacity,
      postcode: req.body.postcode,
      city: req.body.city,
      bigAddress: req.body.bigAddress,
      smallAddress: req.body.smallAddress,
      cost: req.body.cost,
      title: req.body.title,
      content: req.body.content,
      content2: req.body.content2,
      roomstyle: req.body.roomstyle,
    });
    newRoom.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '등록되었습니다.');
      res.redirect('/');
    });
  });
});
router.put('/:id', function(req, res, next) {
  Room.findById({_id: req.params.id}, function(err, room) {
    if (err) {
      return next(err);
    }
    room.content = req.body.content;
    room.capacity = req.body.capacity;
    room.city = req.body.city;
    room.cost = req.body.cost;
    room.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '변경되었습니다.');
      res.redirect('/rooms/lists');
    });
  });
});
router.delete('/:id', function(req, res, next) {
  Room.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success', '삭제되었습니다.');
    res.redirect('/rooms/lists');
  });
});
router.delete('/:id/ccomment', function(req, res, next) {
  Ccomment.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success', '삭제되었습니다.');
    res.redirect('back');
  });
});

module.exports = router;