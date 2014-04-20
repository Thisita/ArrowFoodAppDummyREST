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
function editMenu(req, res) {
  Menu.findOne({ restaurant: req.body.restaurant, name: req.body.name }, function(err, menu) {
    // look for an error
    if(err) {
      // log
      console.log('ERROR: Failed to look up menu [' + err + ']');
      // send error
      res.send(500, err);
    } else {
      if(menu) {
        // update existing menu
        if(req.body.image) menu.image = req.body.image;
        if(req.body.icon) menu.icon = req.body.icon;
        if(req.body.tags) menu.tags = req.body.tags;
        // save the changes
        menu.save(function(err, menu, count) {
          // check for error
          if(err || count != 1) {
            // log
            console.log('ERROR: Could not update menu [' + err + ']');
            // send the bad news
            res.send(500, err);
          } else {
            // send the good news
            res.send('{"success":true}');
          }
        });
      } else {
        // Create new menu
        var a = new Menu();
        a.restraunt = req.body.restaurant;
        a.name = req.body.name;
        a.image = req.body.image;
        a.icon = req.body.icon;
        a.tags = req.body.tags;
        // save it
        a.save(function(err, a, count) {
          // look for error
          if(err || count !== 1) {
            // log
            console.log('ERROR: Could not create new menu [' + err + ']');
            // send error
            res.send(500, err);
          } else {
            // send the good news
            res.send('{"success":true}');
          }
        });
      }
    }
  });
}

// Export the route association function
module.exports = function(app) {
  app.post('/menu', editMenu);
};