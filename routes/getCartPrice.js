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

// Returns the delivery fee based on Arrow Food Couriers service 
// sliding scale
function getDeliveryFee(x) {
  if(x >= 5.00) return 3.99;
  else if(x >= 10.00) return 4.99;
  else if(x >= 20.00) return 5.99;
  else if(x >= 40.00) return 6.99;
  else if(x >= 70.00) return 10.00;
  else return null;
}

// Route handling function
function getCartPrice(req, res) {
  if(req.session.authenticated) {
    // Find the user's cart
    Cart.findOne({'username' : req.session.username}, function(err, cart) {
      if(cart) {
        // Get the menu data
        Menu.find({}, function(err, menus) {
          cart.total = 0.0;
          for(var i = 0; i < cart.items.length; ++i) 
		  {
			cart.total += cart.items[i].total;
            
          }
		  var deliveryFee = 0.0;
		  deliveryFee = getDeliveryFee(cart.total);
		  if(deliveryFee == null)
		  {
			// forbidden to purchase less than a certain amount in an order
			res.send(403);
		  }
		  else
		  {
			  cart.total += deliveryFee;
			  cart.updated = Date.now();
			  // save the cart total
			  cart.save(function(err, cart, count) {
				// check for err
				if(err || count !== 1) {
				  // log
				  console.log('ERROR: Failed to save cart total [' + err + ']');
				  // send the bad news
				  res.send(500, err);
				} else {
				  // send the data
				  res.send(JSON.stringify(cart));
				}
			  })
		  }
        });
      } else {
        // Could not find the cart
        res.send(404);
      }
    });
  } else {
    // Check the session for a cart
    if(!req.session.cart) {
      res.send(404);
    }
    // send the session cart to the user
    res.send(JSON.stringify(req.session.cart));
  }
}

// Export the route association function
module.exports = function(app) {
  app.get('/cart/price', getCartPrice);
};