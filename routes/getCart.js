/*
    ArrowFoodAppDummyREST
    Copyright © 2014 Ian Zachary Ledrick, also known as Thisita.
    
    This file is part of ArrowFoodAppDummyREST.

    ArrowFoodAppDummyREST is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ArrowFoodAppDummyREST is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with ArrowFoodAppDummyREST.  If not, see <http://www.gnu.org/licenses/>.
*/
'use strict';

// Mongoose imports
var mongoose = require('mongoose');
var Cart = mongoose.model('Cart');

var response = [
  {
    menuId: "1",
    itemId: "1",
    quantity: "1"
  },
  {
    menuId: "1",
    itemId: "2",
    quantity: "2"
  }
];

// Route handling function
function cart(req, res) {
  if(req.session.authenticated) {
    // Find the user's cart
    Cart.findOne({'username' : req.session.username}, function(err, cart) {
      if(cart) {
        // Send the cart
        res.send(JSON.stringify(cart));
      } else {
        // Could not find the cart
        res.send(404);
      }
    });
  } else {
    //TODO
  }
}

// Export the route association function
module.exports = function(app) {
  app.get('/cart', cart);
};