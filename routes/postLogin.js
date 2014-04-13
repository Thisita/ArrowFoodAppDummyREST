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
var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');

// The response for a 200 will always be the same.
var response = {};

// Some parameters for the pbkdf2
var iterations = 10000;
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

// Helper function for testing passwords
function checkPassword(attempt, password, salt, cb) {
  // we use pbkdf2 because thisita <3 it
  pbkdf2(attempt, decode(salt), iterations, keylen, function(err, derivedKey) {
    if(derivedKey) {
      // encode the key
      var encodedAttempt = encode(derivedKey);
      // return the result of a check 
      cb(encodedAttempt == password);
    } else {
      // log that there was some weird error
      console.log('pbkdf2() error: ' + err.toString());
      // something broke so check is false
      cb(false);
    }
  });
}

// Route handling function
function login(req, res) {
  // Parse the body
  var json = req.body;
  // check the syntax
  if(json.username && json.password) {
    User.findOne({'username': json.username}, function(err, user) {
      if(user) {
        checkPassword(json.password, user.password, user.salt, function(match) {
          if(match) {
            // log
            console.log(user.username + ' logged in');
            // mark the session
            req.session.authenticated = true;
            // tell the user it was successful
            res.send(JSON.stringify(response));
          } else {
            // log the failure
            console.log('Failed login attempt for ' + user.username + ' (invalid password)');
            // tell the user we could not find
            // why no access denied? because we don't want
            // attackers to tell the difference from
            // no account
            res.send(404);
          }
        });
      } else {
        // log failure
        console.log('Failed login attempt for ' + json.username + ' (invalid username)');
        // if we get nothing tell the user
        // we couldn't find it
        res.send(404);
      }
    });
  } else {
    // if the syntax is bad let the user know
    res.send(400);
  }
}

// Export the route association function
module.exports = function(app) {
  app.post('/login', login);
};