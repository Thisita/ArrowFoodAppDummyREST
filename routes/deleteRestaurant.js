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
var Restaurant = mongoose.model('Restaurant');

// Route handling function
function deleteRestaurant(req, res) {
  // make sure the user is authenticated and an admin
  if(req.session.authenticated && req.session.admin) {
    Restaurant.findOne({ name: req.body.name }, function(err, restaurant) {
      // Check for error
      if (err) {
        // log
        console.log('ERROR: One post Restaurant Restaurant.findOne() [' + err + ']');
        // send the bad news
        res.send(500, err);
      } else {
        // check for data
        if(restaurant) {
          // remove
          restaurant.remove(function(err) {
            // check for err
            if(err) {
              // log
              console.log('ERROR: Could not  remove restaurant [' + err + ']');
              // send bad news
              res.send(500, err);
            } else {
              // send the good news
              res.send('{"success":true}');
            }
          });
        } else {
          // Could not find
          res.send(404);
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
  app.delete('/restaurant', deleteRestaurant);
};