'use strict';

module.exports = function (app) {
	app.route("/")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/index.html");	
		});
		
	app.route("/all")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/allfiles.html");	
		});
		
};