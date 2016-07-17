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
		
	app.route("/my")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/myfiles.html");	
		});
		
	app.route("/settings")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/settings.html");	
		});
		
	app.route("/signup")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/signup.html");	
		});
		
	app.route("/login")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/login.html");	
		});
		
};