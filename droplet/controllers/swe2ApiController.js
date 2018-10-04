'use strict';


var mongoose = require('mongoose'),
  Heartbeat = mongoose.model('Heartbeats');

exports.list_all_heartbeats = function(req, res) {
  Heartbeat.find({}, function(err, heartbeat) {
    if (err)
      res.send(err);
    res.json(heartbeat);
  });
};




exports.create_a_heartbeat = function(req, res) {
  var new_heartbeat = new Heartbeat(req.body);
  new_heartbeat.save(function(err, heartbeat) {
    if (err)
      res.send(err);
    res.json(heartbeat);
  });
};


exports.read_a_heartbeat = function(req, res) {
  Heartbeat.findById(req.params.heartbeatId, function(err, heartbeat) {
    if (err)
      res.send(err);
    res.json(heartbeat);
  });
};


exports.update_a_heartbeat = function(req, res) {
  Heartbeat.findOneAndUpdate({_id: req.params.heartbeatId}, req.body, {new: true}, function(err, heartbeat) {
    if (err)
      res.send(err);
    res.json(heartbeat);
  });
};


exports.delete_a_heartbeat = function(req, res) {


  Task.remove({
    _id: req.params.heartbeatId
  }, function(err, heartbeat) {
    if (err)
      res.send(err);
    res.json({ message: 'Heartbeat successfully deleted' });
  });
};