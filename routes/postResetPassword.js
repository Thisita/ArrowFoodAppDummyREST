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
var PasswordReset = mongoose.model('PasswordReset');

// The response for a 200 will always be the same.
var response = {};

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

// Route handling function
function resetPassword(req, res) {
  // Parse the body
  var json = req.body;
  // check the syntax
  if(json.password) {
    // look for the token
    PasswordReset.findOne({'token': req.params.token}, function(err, passwordReset) {
      // make sure it exists
      if(passwordReset) {
        if((new Date()) < passwordReset.expiration) {
        // find the user attached to the token
          User.findOne({'username': passwordReset.username}, function(err, user) {
            if(user) {
              // Generate the salt
              user.salt = crypto.randomBytes(saltSize).toString('base64');
              // PBKDF2 hash the password
              crypto.pbkdf2(json.password, decode(user.salt), iterations, keylen, function(err3, derivedKey) {
                // Make sure the crypto didn't die
                if(derivedKey) {
                  // Store the hashed password
                  user.password = encode(derivedKey);
                  user.locked = false;
                  user.save(function(err4, user, count) {
                    if(err4 || count !== 1) {
                      // log error
                      console.log("ERROR: " + err4);
                      // Something broke so tell the user
                      res.send(500, err4);
                    } else {
                      // log info
                      console.log("INFO: User " + a.username + " reset");
                      // Send a success response
                      res.send('{"success":true}');
                      // remove the passwordReset with blind faith
                      passwordReset.remove(function(err){});
                    }
                  });
                } else {
                  // log error
                  console.log("ERROR: " + err3);
                  // Something broke so tell the user
                  res.send(500, err3);
                }
              });
              // tell the user it was successful
              res.send(JSON.stringify(response));
            } else {
              // Could not find user doc
              // log
              console.log('ERROR: Could not find user attached to PasswordReset [' + passwordReset.username + ']');
              // send not found error
              res.send(404);
            }
          });
        } else {
          // The token is expired
          // remove the doc
          passwordReset.remove(function(err) {
            // check error
            if(err) {
              // log it
              console.log('ERROR: Could not remove old passwordReset doc [' + err + ']');
            } else {
              // log it
              console.log('INFO: Removed old passwordReset');
            }
            // Send not found error to the user
            res.send(404);
          });
        }
      } else {
        // could not find password reset doc
        // log
        console.log('ERROR: Could not find password reset doc');
        // send not found error
        res.send(404);
      }
    });
  } else {
    // req body not formatted correctly
    // send bad request error
    res.send(400);
  }
}

// Export the route association function
module.exports = function(app) {
  app.post('/user/password/reset/:token', resetPassword);
};