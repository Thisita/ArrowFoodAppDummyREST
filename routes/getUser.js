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

var response = {
  id: 'id',
  email: 'email',
  name: 'name',
  address: 'address',
  phone: 'phone'
};

// Route handling function
function userProfile(req, res) {
  var json = JSON.parse(req.body);
  
  // Check session authentication
  if(req.session.authenticated) {
    if(json.id && json.email && json.name
      && json.address && json.phone) {
      
      // Find the user's profile
      User.findOne({'username' : req.session.username}, 'username email phone address1 address2 city state zip name' , function(err, user) {
        if(user) {
          // Send profile
          res.send(JSON.stringify(user));
        } else {
          // Could not find the profile
          res.send(404);
        }
      });
    } else {
      // Bad request
      res.send(400);
    }
  } else {
    // Unauthorized
    res.send(401);
  }
}

// Export the route association function
module.exports = function(app) {
  app.get('/user', userProfile);
};