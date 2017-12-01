'use strict';

module.exports = function(app) {
	var myPythonScriptPath = 'app/controllers/test.py';
	var PythonShell = require('python-shell');


	app.listen(process.env.PORT, function() {
		console.log("App listening on port " + process.env.PORT + "...");
	});
	//var searchItunes = require("searchitunes");
	//	var ObjectId = require("mongodb").ObjectId;
	//	var passport = require("passport");
	//	var flash=require("connect-flash");
	//	var validator = require("validator");
	//	var bcrypt = require("bcrypt-nodejs");
	//	app.use(flash());

	app.route("/")
		.get(function(req, res) {
			res.sendFile(process.cwd() + "/public/index.html");
		});

	app.route("/analyzeSong")
		.post(function(req, res) {
			var pyshell = new PythonShell(myPythonScriptPath);

			pyshell.on('message', function(message) {
				// received a message sent from the Python script (a simple "print" statement)
				console.log(message);
			});

			// end the input stream and allow the process to exit
			pyshell.end(function(err) {
				if (err) {
					throw err;
				}

				console.log('finished');
			});
			
			res.send("Analyzing...");
		});

};