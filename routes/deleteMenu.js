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
var Menu = mongoose.model('Menu');

// Route handling function
function deleteMenu(req, res) {
  // make sure user is authenticate and admin
  if(req.session.authenticated && req.session.admin) {
    // look in the db for the menu
    Menu.findOne({ restaurant: req.body.restaurant, name: req.body.name }, function(err, menu) {
      // look for an error
      if(err) {
        // log
        console.log('ERROR: Failed to look up menu [' + err + ']');
        // send error
        res.send(500, err);
      } else {
        if(menu) {
          // remove the found menu
          menu.remove(function(err) {
            // Check for error
            if(err) {
              // log
              console.log('ERROR: failed to remove menu [' + err + ']');
              // send the bad news
              res.send(500, err);
            } else {
              // send the good news
              res.send('{"success":true}');
            }
          });
        } else {
          // send 404
          res.send(404);
        }
      }
    });
  } else {
    // tell them they aren't allowed
    res.send(403);
  }
}

// Export the route association function
module.exports = function(app) {
  app.delete('/menu', deleteMenu);
};