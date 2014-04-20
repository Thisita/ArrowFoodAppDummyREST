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

// Mongoose imports
var mongoose = require('mongoose');
var Coupon = mongoose.model('Coupon');

// Route handling function
function createCoupon(req, res) {
  // make sure the user is authenticated and an admin
  if(req.session.authenticated && req.session.admin) {
    Coupon.findOne({ name: req.body.name }, function(err, coupon) {
      // Check for error
      if (err) {
        // log
        console.log('ERROR: One post Coupon Coupon.findOne() [' + err + ']');
        // send the bad news
        res.send(500, err);
      } else {
        // check for data
        if(coupon) {
          // error out (edit conflict, as it already exists)
          res.send(409);
        } else {
          // Create
          var a = new Coupon();
          a.token = req.body.token;
          a.type = req.body.type;
          a.param = req.body.param;
          // save
          a.save(function(err, a, count) {
            // check for err
            if(err || count !== 1) {
              // log
              console.log('ERROR: Could not save new coupon [' + err + ']');
              // send the bad news
              res.send(500, err);
            } else {
              // send the good news
              res.send('{"success":true}');
            }
          });
        }
      }
    });
  } else {
    // they aren't allowed so 403
    res.send(403);
  }
}

// Export the route association function
module.exports = function(app) {
  app.post('/coupon', createCoupon);
};