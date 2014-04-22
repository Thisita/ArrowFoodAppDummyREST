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
var Cart = mongoose.model('Cart');
var Menu = mongoose.model('Menu');

// Route handling function
function getCart(req, res) {
  if(req.session.authenticated) {
    // get the menus so we can update totals
    Menu.find({}, function(err, menus) {
      if(err) {
        // log
        console.log('ERROR: Could not get menus [' + err + ']');
        // send the bad news
        res.send(500, err);
      } else if(menus) {
        // Find the user's cart
        Cart.findOne({'username' : req.session.username}, function(err, cart) {
          if(cart) {
            // update the prices
            for(var i = 0; i < cart.items.length; ++i) {
              for(var j = 0; j < menus.length; ++j) {
                if(menus[j].name === cart.items[i].menu
                  && menus[j].restaurant === cart.items[i]) {
                  for(var k = 0; k < menus[j].items.length; ++k) {
                    if(menus[j].items[k].name === cart.items[i].item) {
                      cart.items[i].total = cart.items[i].quantity * menus[j].items[k].price;
                      break;
                    }
                  }
                  break;
                }
              }
            }
            // Send the cart
            res.send(JSON.stringify(cart));
          } else {
            // Could not find the cart
            res.send(404);
          }
        });
      } else {
        // log
        console.log('ERROR: No menus returned');
        // send the bad news
        res.send(404, 'No menus returned by MongoDB');
      }
    });
  } else {
    // Check the session for a cart
    if(!req.session.cart) {
      // if it isn't there init it
      req.session.cart = {
        items: [],
        updated: new Date(),
        created: new Date()
      };
    }
    // send the session cart to the user
    res.send(JSON.stringify(req.session.cart));
  }
}

// Export the route association function
module.exports = function(app) {
  app.get('/cart', getCart);
};