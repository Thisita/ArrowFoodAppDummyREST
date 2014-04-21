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
function deleteMenuItem(req, res) {
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
          // look for the item
          var found = false;
          for(var i = 0; i < menu.items.length; ++i) {
            if(menu.items[i].name === req.body.name) {
              // update
              found = true;
              // remove the item
              menu.items.splice(i, 1);
              menu.markModified('items');
              menu.updated = new Date();
              // save the changes
              menu.save(function(err, menu, count) {
                // check for err
                if(err || count !== 1) {
                  // log
                  console.log('ERROR: Could not save menu after item removal [' + err + ']');
                  // send the bad news
                  res.send(500, err);
                } else {
                  // send the good news
                  res.send('{"success":true}');
                }
              });
              // break the loop
              break;
            }
          }
          if(!found) {
            // Send 404
            res.send(404);
          }
        } else {
          // The menu doesn't exist, 404
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
  app.delete('/menu/item', deleteMenuItem);
};