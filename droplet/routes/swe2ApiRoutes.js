'use strict';
module.exports = function(app) {
  var gateWay = require('../controllers/swe2ApiController');

  // todoList Routes
  app.route('/heartbeats')
    .get(gateWay.list_all_heartbeats)
    .post(gateWay.create_a_heartbeat);


  app.route('/heartbeats/:heartbeatId')
    .get(gateWay.read_a_heartbeat)
    .put(gateWay.update_a_heartbeat)
    .delete(gateWay.delete_a_heartbeat);
};
