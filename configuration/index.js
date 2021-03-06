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

var url = process.env.MONGOHQ_URL || 'mongodb://localhost/afdb';

module.exports = function(app, express) {
  var MongoStore = require('connect-mongo')(express);
  // global config
  app.use(require('morgan')());
  // session
  app.use(require('cookie-parser')());
  app.use(require('express-session')({
    secret: 'random_data',
    cookie: {
      expires: new Date(Date.now() + 60000 * 60 * 24),
      maxAge: 60000 * 60 * 24
    },
    store: new MongoStore({
      url: url
    })
  }));
  // parse the body
  app.use(require('body-parser')());
  
  // dev config
  if(process.env.NODE_ENV == 'development') {
    app.use(require('errorhandler')({
      dumpExceptions: true,
      showStack: true
    }));
  } else {
    // prod config
    app.use(require('errorhandler')());
  }
};