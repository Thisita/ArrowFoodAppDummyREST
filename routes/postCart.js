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

// j0nnyD:
/*
 * You need to: findOne() the user's cart
 * Update the schema buy adding a cart item.
 * The req.body will contain json with options.
 *
 * You need to CHECK FIRST if a similar item already exists
 * This will be the case that you just add to the quantity in cart
 *
 * You need to DEEP CHECK the options to make sure that
 * you really need to make a new item instance in the cart
 *
 * And then of course save the data
 * This function is going to be very deep.
 * If you feel the need, you can separate everything out into helper functions.
 * If you do, and your function returns something, you MUST instead require a callback
 * Functions that return data are blocking, and that is not allowed in this case.
 * 
 * For item information, it will be passed as req.params. things proceeded by a :
 * if you run into trouble, message me
 */
// Route handling function
function cart(req, res) {
  var quantity = parseInt(req.params.quantity);
  if(!isNaN(quantity)) {
    if(req.params.menuId == menuId
      && req.params.itemId == itemId) {
      res.send(JSON.stringify(response));
    } else {
      res.send(404);
    }
  } else {
    res.send(400);
  }
}

// Export the route association function
module.exports = function(app) {
  app.post('/cart/:restaraunt/:menu/:item/:quantity', cart);
};