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
var Achievement = mongoose.model('Achievement');

// Route handling function
function removeAchievement(req, res) {
	// Check if the user is signed in admin
	if(req.session.authenticated && req.session.admin) {
    // look to see if one exists
    Achievement.findOne({ name: req.body.name }, function(err, achievement) {
      // Check for err
      if(err) {
        // log
        console.log('ERROR: Could not look up Achievement.findOne() [' + err + ']');
        // send the bad news
        res.send(500, err);
      } else {
        // check to see if exists
        if(achievement) {
          // remove
          achievement.remove(function(err) {
            // Check for err
            if(err) {
              // log
              console.log('ERROR: Could not remove achievement [' + err + ']');
              // send the bad news
              res.send(500, err);
            }
          });
        } else {
          // not found
          res.send(404);
        }
      }
    });
  } else {
    // not allowed
    res.send(403);
  }
}

// Export the route association function
module.exports = function(app) {
  app.delete('/achievement', removeAchievement);
};