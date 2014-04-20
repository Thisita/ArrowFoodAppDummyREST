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
var User = mongoose.model('User');

var response = {};

// Route handling function
function user(req, res) {
  console.log(JSON.stringify(req.body));
  var json = req.body;
  
  // Check session authentication and admin
  if(req.session.authenticated && req.session.admin) {
    // Find the user's profile
    User.findOne({'username' : req.params.username}, 'roles' , function(err, userData){
      if(userData) {
        // Store the data
        userData.roles.push(req.params.role);
        userData.markModified('roles');
        // Save the data
        userData.save(function(err, userData, count) {
          // Check for error
          if(err || count !== 1) {
            // log
            console.log('ERROR: Update user roles failed [' + err + ']');
            // send error
            res.send(500, err);
          } else {
            // send success
            res.send(JSON.stringify(userData));
          }
        });
      } else {
        // Could not find the profile
        res.send(404);
      }
    });
  } else {
    // not allowed
    res.send(403);
  }
}

// Export the route association function
module.exports = function(app) {
  app.post('/user/:username/role/:role', user);
};