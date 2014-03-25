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

var response = {
  id: 1,
  status: "status",
  coordinates: {
    latitude: -40.2030,
    longitude: 32.9394
  },
  cart: {
  }
};

var authenticated = true;
var orderId = 1;

// Route handling function
function orders(req, res) {
  if(authenticated) {
    if(req.params.orderId == orderId) {
      res.send(JSON.stringify(response));
    } else {
      res.send(404);
    }
  } else {
    res.send(401);
  }
}

// Export the route association function
module.exports = function(app) {
  app.post('/orders/:orderId', orders);
};