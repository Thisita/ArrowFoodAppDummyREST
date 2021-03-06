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
var CartSchema = mongoose.model('Cart').schema;

// Schema for status items
var orderStatusSchema = new mongoose.Schema({
  authority: String,
  state: String,
  created: { type: Date, default: Date.now }
});

// Schema for the order
var orderSchema = new mongoose.Schema({
  username: String,
  created: { type: Date, default: Date.now },
  billing: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String
  },
  shipping: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String
  },
  updates: [orderStatusSchema],
  cart: [CartSchema], // this is a dirty, dirty DIRTY hack
  rating: Number,
  comment: String
});

// Export the schema
var Order = module.exports = mongoose.model('Order', orderSchema);