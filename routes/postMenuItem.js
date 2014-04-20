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
function editMenuItem(req, res) {
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
              // copy over the data
              if(req.body.price) menu.items[i].price = req.body.price;
              if(req.body.icon) menu.items[i].icon = req.body.icon;
              if(req.body.image) menu.items[i].image = req.body.image;
              if(req.body.tags) menu.items[i].tags = req.body.tags;
              if(req.body.description) menu.items[i].description = req.body.description;
              if(req.body.itemOptions) menu.items[i].itemOptions = req.body.itemOptions;
              // break the loop
              break;
            }
          }
          if(!found) {
            // create new item
            menu.items.push({
              name: req.body.name,
              price: req.body.price,
              icon: req.body.icon,
              image: req.body.image,
              tags: req.body.tags,
              description: req.body.description,
              itemOptions: req.body.itemOptions
            });
            menu.markModified('items');
          }
          // Save the changes
          menu.save(function(err, menu, count) {
            // check for err
            if(err || count !== 1) {
              // log
              console.log('ERROR: Could not save item to menu [' + err + ']');
              // send the bad news
              res.send(500, err);
            } else {
              // send the good news
              res.send('{"success":true}');
            }
          });
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
  app.post('/menu/item', editMenuItem);
};