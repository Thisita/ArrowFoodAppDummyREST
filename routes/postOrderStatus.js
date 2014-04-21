/*
    ArrowFoodAppREST
    Copyright © 2014 Ian Zachary Ledrick, also known as Thisita.
    
    This file is part of ArrowFoodAppREST.

    ArrowFoodAppREST is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ArrowFoodAppREST is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with ArrowFoodAppREST.  If not, see <http://www.gnu.org/licenses/>.
*/
'use strict';

// Some includes
var mongoose = require('mongoose');
var Order = mongoose.model('Order');

// Route handling function
function updateOrderStatus(req, res) {
  // Check if the user is auth and a driver or admin
  if(req.session.authenticated && (req.session.driver || req.session.admin)) {
    Order.findById(req.params.id, function(err, order) {
      // check for err
      if(err) {
        // log
        console.log('ERROR: Could not find order to update [' + err + ']');
        // send the bad news
        res.send(500, err);
      } else {
        // Update
        order.updates.push({
          authority: req.session.username,
          state: req.body.state
        });
        order.updated = new Date();
        order.markModified('updates');
        // save
        order.save(function(err, order, count) {
          // check for err
          if(err || count !== 1) {
            // log
            console.log('ERROR: Could not save update to order [' + err + ']');
            // send the bad news
            res.send(500, err);
          } else {
            // send the good news
            res.send('{"success":true}');
          }
        });
      }
    });
  } else {
    // If they aren't authenticated we
    // obviously can't tag the geo data
    // to their account
    res.send(403);
  }
}

// Export the route association function
module.exports = function(app) {
  app.post('/order/:id', updateOrderStatus);
};