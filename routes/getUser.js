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
  // Check session authentication
  if(req.session.authenticated) {
    // Find the user's profile
    User.findOne({'username' : req.session.username}, 'username email phones addresses achievements name icon image roles created updated orders deliveries' , function(err, user) {
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
}

// Export the route association function
module.exports = function(app) {
  app.get('/user', userProfile);
};