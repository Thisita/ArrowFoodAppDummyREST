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

// Some parameters for the pbkdf2
var saltSize = 128;
var rounds = 10000;
var keylen = 2048;

// Helper to encode base64
function encode(text) {
  return new Buffer(text, 'utf8').toString('base64');
}

// Helper decode base64
function decode(text) {
  // yay buffers
  return new Buffer(text, 'base64').toString('utf8');
}

var response = {};

// Route handling function
function user(req, res) {
  console.log(JSON.stringify(req.body));
  var json = req.body;
  
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
    // Check to see if enough data is provided to register a user
    if(json.username && json.email && json.name && json.password) {
      // Check and see if the username exists
      User.find({ 'username' : json.username }, function(err, userData) {
        if(userData) {
          // log info
          console.log("INFO: Username already taken " + json.username);
          // The username exists, error out
          res.send(JSON.stringify('{"error":"Username already in use"}'));
        } else {
          // Check and see if email exists
          User.find({ 'email' : json.email }, function(err2, userData2) {
            if(userData2) {
              // log info
              console.log("INFO: Email already taken " + json.email);
              // The email exists, error out
              res.send(JSON.stringify('{"error":"Email already in use"}'));
            } else {
              // log info
              console.log("INFO: Creating user " + json.username);
              // Create a new user
              var a = new User();
              a.username = json.username;
              a.email = json.email;
              a.name = json.name;
              a.role = 'customer';
              a.phones = json.phones; // Might have to deep copy
              a.addresss = json.addresss; // Might have to deep copy
              // Generate the salt
              a.salt = crypto.randomBytes(saltSize).toString('base64');
              // PBKDF2 hash the password
              crypto.pbkdf2(json.password, decode(a.salt), iterations, keylen, function(err3, derivedKey) {
                // Make sure the crypto didn't die
                if(derivedKey) {
                  // Store the hashed password
                  a.password = encode(derivedKey);
                  a.save(function(err4, a, count) {
                    if(err4 || count !== 1) {
                      // log error
                      console.log("ERROR: " + err4);
                      // Something broke so tell the user
                      res.send(500);
                    } else {
                      // log info
                      console.log("INFO: User " + a.username + " created");
                      // Send a success response
                      res.send('{"error":false}');
                    }
                  });
                } else {
                  // log error
                  console.log("ERROR: " + err3);
                  // Something broke so tell the user
                  res.send(500);
                }
              });
            }
          });
        }
      });
    }
  }
}

// Export the route association function
module.exports = function(app) {
  app.post('/user', user);
};