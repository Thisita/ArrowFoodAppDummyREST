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

// Schema for menu item options
// type is a syntactical string denoting 
//   how the the option is to be rendered
// defaultValue is the string representation
//   of value(s) that should be defaulted to
var menuItemOptionSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: String,
  default: String,
  created: { type: Date, default: Date.now }
});

// Schema for menu items
// Picture is a base64 encoded png
// we could use a Buffer type, but
// it is believed that it uses more space
var menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  picture: String,
  tags: [String],
  options: [menuItemOptionSchema],
  description: String,
  created: { type: Date, default: Date.now }
});

// Schema for menu
var menuSchema = new mongoose.Schema({
  restaurant: String,
  items: [menuItemSchema],
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

// Export the schema
var Menu = module.exports = mongoose.model('Menu', menuSchema);