/*
    ArrowFoodAppDummyREST
    Copyright © 2014 Ian Zachary Ledrick, also known as Thisita.
    
    This file is part of ArrowFoodAppDummyREST.

    ArrowFoodAppDummyREST is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ArrowFoodAppDummyREST is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with ArrowFoodAppDummyREST.  If not, see <http://www.gnu.org/licenses/>.
*/
'use strict';

// Mongoose imports
var mongoose = require('mongoose');
var User = mongoose.model('User');

var response = {};

// Route handling function
function user(req, res) {
  var json = JSON.parse(req.body);
  
  // Check session authentication
  if(req.session.authenticated) {
    if(json.id && json.email && json.name
      && json.address && json.phone) {
      
      // Find the user's profile
      User.findOne({'username' : req.session.username}, 'username email phone address1 address2 city state zip name' , function(err, userData){
        if(userData) {
          // Send profile
          res.send(JSON.stringify(userData));
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
    // TODO: Implement functionality to
    // register a user
    
    // Check to see if enough data is provided to register a user
    if(json.username && json.email && json.name && json.password) {
      // Check and see if the username exists
      User.find({ 'username' : json.username }, function(err, userData) {
        if(userData) {
          // The username exists, error out
          res.send(JSON.stringify('{"error":"Username already in use"}'));
        } else {
          // Check and see if email exists
          User.find({ 'email' : json.email }, function(err, userData2) {
            if(userData2) {
              // The email exists, error out
              res.send(JSON.stringify('{"error":"Email already in use"}'));
            } else {
              // TODO: Register the user
            }
          });
        }
      });
    }
    res.send(501);
  }
}

// Export the route association function
module.exports = function(app) {
  app.post('/user', user);
};