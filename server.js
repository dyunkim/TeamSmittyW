'use strict';

var express = require("express");
var session = require("express-session");
require("node-env-file")(".env");
var routes = require("./app/routes/index.js");
var bodyParser = require("body-parser");
var mongo = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var validator = require("validator");
var flash=require("connect-flash");
var app = express();

mongo.connect(process.env.MONGO_URI, function (err, db) {
    if (err) throw err;
    app.use("/public", express.static(process.cwd() + "/public"));
    app.use("/controllers", express.static(process.cwd() + "/app/controllers/"));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({ secret: process.env.SESS_SECRET }));
	  app.use(passport.initialize());
	  app.use(passport.session());
	  app.use(flash());
    routes(app, db);
    
    
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pass'
      },
      function(username, password, done) {
        if (validator.isEmail(username)) {
          var clients = db.collection("clients");
          clients.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Incorrect email.' });
            }
            if (user.pass !== validator.escape(password)) {
              console.log(user.pass);
              return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
          });
        }
        else {
          return done(null, false, { message: 'Invalid email.' });
        }
      }
    ));
    
    
    passport.serializeUser(function(user, done) {  
    	done(null, user["_id"]);
	});

	passport.deserializeUser(function(id, done) {  
		var clients = db.collection("clients");
    	clients.findOne({ _id: ObjectId(id) }, function (err, user) {
        	done(err, user);
    	});
	});
    
    
    app.listen(process.env.PORT, function () {
    	console.log("App listening on port " + process.env.PORT + "...");	
    });
});
