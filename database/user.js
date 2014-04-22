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

// Import the mongoose
var mongoose = require('mongoose');
var fs = require('fs');

// get a default image
var dImage = fs.readFileSync('./jolly.png');

// A schema for address
// They get a nickname for user search purposes
var addressSchema = new mongoose.Schema({
  name: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  zip: String,
  defaultBilling: Boolean,
  defaultShipping: Boolean,
  created: { type: Date, default: Date.now }
});

// A schema for phone/fax
// Gets a name for user search eg "Fax", "Carryout", "Headquarters"
var phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
  default: Boolean,
  created: { type: Date, default: Date.now }
});

// The User schema
// Images are png buffers
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  salt: String,
  roles: [String],
  email: String,
  name: String,
  image: { type: Buffer, default: dImage },
  icon: { type: Buffer, default: dImage },
  achievements: [String],
  phones: [phoneSchema],
  addresses: [addressSchema],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  orders: { type: Number, default: 0 },
  deliveries: { type: Number, default: 0 },
  locked: { type: Boolean, default: false }
});

var User = module.exports = mongoose.model('User', userSchema);