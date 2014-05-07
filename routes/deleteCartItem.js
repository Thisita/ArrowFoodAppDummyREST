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
function cart(req, res) {
	req.params.restaurant = decodeURIComponent(req.params.restaurant);
	req.params.menu = decodeURIComponent(req.params.menu);
	req.params.item = decodeURIComponent(req.params.item);
	// debug log
	console.log('DEBUG: deleteCartItem [' + [req.params.restaurant,req.params.menu,req.params.item] + ']');
	// Boolean for knowing if the item has been deleted
	var deleted = false;
	// Check if the user is signed in
	if(req.session.authenticated) {
		Cart.findOne({'username' : req.session.username}, function(err, cart) {
			if(cart) {
				// Check that the menu exists
				Menu.findOne({'restaurant' : req.params.restaurant, 'name' : req.params.menu}, function(err, menu){
					if(menu) {
						for (var i = 0; i < menu.items.length; ++i) {
							// Check that the item actually exists in the menu
							if(menu.items[i].name == req.params.item) {
								for (var j = 0; j < cart.items.length; ++j) {
									// Check the quantity
									if(cart.items[i].quantity > 1) {
										// Decrement quantity of there is more than one
										--cart.items[i].quantity;
										
										// Save the cart
										cart.markModified('items');
										cart.updated = new Date();
										cart.save(function(err) {
										 if(err) {
											console.error("Error: Failed to delete cart item [" + err + "]");
											res.send(500);
											} else {
												// Send success
												res.send('{"success":true}');
											}
										});
										
										// Set boolean to true to escape the other for loop
										deleted = true;
										break;
									} else {
										// Remove the item completely from the cart
										cart.items.splice(i, 1);
										
										// Save the cart
										cart.markModified('items');
										cart.updated = new Date();
										cart.save(function(err) {
										 if(err) {
											console.error("Error: Failed to delete cart item [" + err + "]");
											res.send(500);
											} else {
												// Send success
												res.send('{"success":true}');
											}
										});
										
										// Set boolean to true to escape the other for loop
										deleted = true;
										break;
									}
								}
								// Break out if the item was decremented
								if (deleted) {
									break;
								} else {
									// If the item was not found in the cart
									console.log("User logged in, but item not found in cart.");
									res.send(404);
								}
							}
						}
					} else {
						// Item not found
						console.log("User logged in, but item not found.");
						res.send(404);
					}
				});
			} else {
				// Could not find the cart
				console.log("User logged in, but could not find cart.");
				res.send(404);
			}
		});
	// Else not signed in, use the cart in the request
	} else {
		if(req.session.cart){
			Menu.findOne({'restaurant' : req.params.restaurant, 'name' : req.params.menu}, function(err, menu){
				if(menu) {
					for (var i = 0; i < menu.items.length; ++i) {
						// Check that the item actually exists in the menu
						if(menu.items[i].name == req.params.item) {
							for (var j = 0; j < req.session.cart.items.length ; ++j) {
								// Check that item is actually in the cart
								if(req.session.cart.items[j] == req.params.item) {
									// Check the quantity
									if(req.session.cart.items[i].quantity > 1) {
										// Decrement quantity of there is more than one
										--req.session.cart.items[i].quantity;
										
										// Set boolean to true to escape the other for loop
										deleted = true;
										req.session.cart.updated = new Date();
										// Send success
										res.send('{"success":true}');
										break;
									} else {
										// Remove the item completely from the cart
										req.session.cart.items.splice(i, 1);
										
										// Set boolean to true to escape the other for loop
										deleted = true;
										req.session.cart.updated = new Date();
										// Send success
										res.send('{"success":true}');
										break;
									}
								}
							}
							// Break out if the item was decremented
							if (deleted) {
								break;
							} else {
								// If the item was not found in the cart
								console.log("User not logged in & could not find item in cart.");
								res.send(404);
							}
						}
					}
				} else {
					// Item not found
					console.log("User not logged in & could not find item.");
					res.send(404);
				}
			});
		} else {
			// Could not find the cart
			console.log("User not logged in & could not find cart.");
			res.send(404);
		}
	}
}

// Export the route association function
module.exports = function(app) {
  app.delete('/cart/:restaurant/:menu/:item', cart);
};