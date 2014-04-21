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
var mail = require('nodemailer').mail;

// The response for a 200 will always be the same.
var response = {};
// Some parameters for password reset
var tokenSize = 128; // bytes
var expiration = 3; // days

// Route handling function
function resetPassword(req, res) {
  User.findOne({'username': req.params.username}, function(err, user) {
    if(user) {
      // Generate a new token
      var a = new PasswordReset();
      a.username = user.username;
      // generate the token data
      crypto.randomBytes(tokenSize, function(err, buf) {
        // check for err
        if(err) {
          // log
          console.log('ERROR: Unable to generate token for password reset');
          // send error
          res.send(500, err);
        } else {
          // store the token
          a.token = crypto.createHash('md5').update(buf).digest('hex');
          // set the expiration
          a.expiration = (new Date()).setDate((new Date()).getDate() + expiration);
          // save the doc
          a.save(function(err, a, count) {
            // Did something break?
            if(err || count !== 1) {
              // log the error
              console.log('ERROR: Could not save password reset document for ' + user.username + ' [' + err + ']');
              // return error
              res.send(500, err);
            } else {
              // Send mail to the user
              mail({
                from: 'Arrow Food Couriers Online Services <noreply@arrowmyfood.com>', // sender address
                to: user.email, // list of receivers
                subject: 'Password Reset', // Subject line
                text: 'Your reset token is ' + a.token, // plaintext body
                html: '<p>Your reset token is <b>' + a.token + '</b><p>' // html body
              });
              // lock the account
              user.locked = true;
              user.updated = new Date();
              // Save the locked
              user.save(function(err, user, count) {
                // look for error
                if(err || count !== 1) {
                  // log
                  console.log('ERROR: Could not lock the user account after creating password reset document [' + err + ']');
                }
                // send the all clear
                res.send('{"success":true}');
              });
            }
          });
        }
      });
    } else {
      // Could not find user doc
      // log
      console.log('ERROR: Could not find user [' + json.username + ']');
      // send not found error
      res.send(404);
    }
  });
}

// Export the route association function
module.exports = function(app) {
  app.post('/user/:username/reset', resetPassword);
};