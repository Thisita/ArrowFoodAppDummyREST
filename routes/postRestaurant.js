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
function editRestaurant(req, res) {
  console.log("name: " + req.body.name);
  // make sure the user is authenticated and an admin
  if(true) {
  //if(req.session.authenticated && req.session.admin) {
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
          // Update
          if(req.body.image) restaurant.image = req.body.image;
          if(req.body.icon) restaurant.icon = req.body.icon;
          if(req.body.description) restaurant.description = req.body.description;
          if(req.body.tags) restaurant.tags = req.body.tags;
          if(req.body.emails) restaurant.emails = req.body.emails;
          if(req.body.phones) restaurant.phones = req.body.phones;
          if(req.body.addresses) restaurant.addresses = req.body.addresses;
          restaurant.updated = new Date();
          // save
          restaurant.save(function(err, restaurant, count) {
            // check for err
            if(err || count !== 1) {
              // log
              console.log('ERROR: Could not save changes to restaurant [' + err + ']');
              // send bad news
              res.send(500, err);
            } else {
              // send the good news
              res.send('{"success":true}');
            }
          });
        } else {
          // Create
          var a = new Restaurant();
          a.name = req.body.name;
          if(req.body.image) a.image = req.body.image;
          if(req.body.icon) a.icon = req.body.icon;
          a.description = req.body.description;
          a.tags = req.body.tags;
          a.emails = req.body.emails;
          a.phones = req.body.phones;
          a.addresses = req.body.addresses;
          // save
          a.save(function(err, a, count) {
            // check for err
            if(err || count !== 1) {
              // log
              console.log('ERROR: Could not save new restaurant [' + err + ']');
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
  app.post('/restaurant', editRestaurant);
};