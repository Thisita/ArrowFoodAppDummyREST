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

var response = [
  {
    id: 'id1',
    name: 'name',
    description: 'description',
    cuisine: 'cuisine',
    priceRange: 'priceRange'
  },
  {
    id: 'id2',
    name: 'name',
    description: 'description',
    cuisine: 'cuisine',
    priceRange: 'priceRange'
  },
  {
    id: 'id3',
    name: 'name',
    description: 'description',
    cuisine: 'cuisine',
    priceRange: 'priceRange'
  }
];

// Route handling function
function menu(req, res) {
  res.send(JSON.stringify(response));
}

// Export the route association function
module.exports = function(app) {
  app.get('/menus', menus);
};