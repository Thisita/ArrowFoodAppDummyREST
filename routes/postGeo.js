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

// Some includes
var mongoose = require('mongoose');
var Geotag = mongoose.model('Geotag');

// Route handling function
function geotag(req, res) {
  // Check if the user is auth
  if(req.session.authenticated) {
    // create a new Geotag doc
    var a = new Geotag();
    // store the data
    a.username = req.session.username;
    a.latitude = parseFloat(req.params.latitude);
    a.longitude = parseFloat(req.params.longitude);
    // save to the database
    a.save(function(err, a, count) {
      // Check for db error
      if(err || count !== 1) {
        // log
        console.log('ERROR: Failed to geotag ' + req.session.username +
         ' [' + err + ']');
        // If the db encountered an error send a 500
        res.send(500, err);
      } else {
        // log
        console.log('INFO: Succesfully geotagged ' + req.session.username);
        // Send success
        res.send('{"success":true}');
      }
    });
  } else {
    // If they aren't authenticated we
    // obviously can't tag the geo data
    // to their account
    res.send(403);
  }
}

// Export the route association function
module.exports = function(app) {
  app.post('/geotag/:latitude/:longitude', geotag);
};