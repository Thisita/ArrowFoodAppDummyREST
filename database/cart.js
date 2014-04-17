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

// Import mongoose
var mongoose = require('mongoose');

// Schema for the item options
var cartItemOptionSchema = new mongoose.Schema({
  name: String,
  type: String,
  param: String,
  created: { type: Date, default: Date.now }
});

// Schema for the items in the cart
var cartItemSchema = new mongoose.Schema({
  menu: String,
  restraunt: String,
  item: String,
  options: [cartItemOptionSchema],
  quantity: Number,
  total: Number,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

// Schema for the cart itself
var cartSchema = new mongoose.Schema({
  username: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  items: [cartItemSchema],
  coupons: [String],
  total: Number
});

// Export the schema
var Cart = module.exports = mongoose.model('Cart', cartSchema);