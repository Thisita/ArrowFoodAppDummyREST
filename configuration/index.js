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

module.exports = function(app, express, MongoStore) {
  // global config
  app.configure(function() {
    app.use(express.logger());
    // session
    app.use(express.cookieParser());
    app.use(express.session({
      secret: 'random_data',
      maxAge: new Date(Date.now() + 3600000),
      store: new MongoStore({
        db: 'afdb',
        host: 'localhost',
        user: 'afdbuser',
        password: 'arrowfoodmyfoodisgreat'
      })
    }));
    // routing
    app.use(app.router);
  });
  
  // dev config
  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  
  // prod config
  app.configure('production', function() {
    app.use(express.errorHandler());
  });
};