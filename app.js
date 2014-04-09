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

// Imports
var express = require('express');

// Create the app
var app = module.exports = express();

// Get db instance
var db = require('./database');

// Delegate work
require('./configuration')(app, express);
require('./routes')(app, db);

// Get the port
var port = Number(process.env.PORT || 8080);
// Start listening on the port
app.listen(port, function(){
  // report to log
	console.log("ArrowFoodAppDummyREST server listening on port  " + port);
});
