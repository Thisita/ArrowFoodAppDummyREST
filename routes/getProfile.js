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

var mongoose = require('mongoose');
var User = mongoose.model('User');

var response = {
  id: 'id',
  email: 'email',
  name: 'name',
  address: 'address',
  phone: 'phone'
};

var authenticated = true;

// Route handling function
function profile(req, res) {
  var json = JSON.parse(req.body);
  
  if(authenticated) {
    res.send(JSON.stringify(response));
  } else {
    res.send(401);
  }
}

// Export the route association function
module.exports = function(app) {
  app.get('/profile', profile);
};