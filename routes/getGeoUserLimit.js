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
  // Allow admin page to get data
  res.set('Access-Control-Allow-Origin', '*');
  // Check if the user is auth
  if(req.session.authenticated && req.session.admin) {
    // Get the user's geotags
    Geotag.find({ username: req.params.username })
      .sort({ created: -1 }) // sort so we get most recent
      .limit(req.params.limit) // limit the num of results
      .exec(function(err, geotags) {
        // check for errors
        if(err) {
          // log
          console.log('ERROR: Failed to retrieve ' + req.params.username + '\'s geotags [' + err + ']');
          // send error
          res.send(500, err);
        } else {
          // Successful in getting data
          res.send(JSON.stringify(geotags));
        }
    });
  } else {
    // If they aren't authenticated admins
    // They don't have permission
    res.send(403);
  }
}

// Export the route association function
module.exports = function(app) {
  app.get('/geotag/:username/:limit', geotag);
};