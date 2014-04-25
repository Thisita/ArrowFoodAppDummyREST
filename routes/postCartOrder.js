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

var mongoose = require('mongoose');
var Cart = mongoose.model('Cart');
var Order = mongoose.model('Order');

// Route handling function
function cartOrder(req, res) {
  // This function would empty the cart and place an order
  // it is not complete, there should be a JSON body
  // with order info in it.
  
  /*
   * @j0nnyD instructions
   * Look for user cart
   * copy that data to a new order
   * save the order
   * remove the cart
   *
   * There will be JSON in the req.body that will contain order info
   * including the shipping and billing address which you will have to
   * save in the order. Check the order schema, do what makes sense
   */
	 
	 if(req.session.authenticated) {
    // Find the user's cart
    Cart.findOne({'username' : req.session.username}, function(err, cart) {
      if(cart) {
        // Copy the cart to the order
				var json = req.body;
				var newOrder = new Order();
				newOrder.username = req.session.username;
				newOrder.cart = cart;
				newOrder.shipping = json.shipping;
				newOrder.billing = json.billing;
				
				// Save the order
				newOrder.save(function(err) {
					 if(err) {
						console.error("Error: Failed to save the order [" + err + "]");
						res.send(500);
						} else {
							// Send success
							res.send('{"success":true}');
						}
				});
				
      } else {
        // Could not find the cart
        res.send(404);
      }
    });
  } else {
    // Unauthenticated
		res.send(403);
  }
}

// Export the route association function
module.exports = function(app, db) {
  app.post('/cart/order', cartOrder);
};