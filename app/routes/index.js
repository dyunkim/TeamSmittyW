'use strict';

module.exports = function (app, db) {
	var searchItunes = require("searchitunes");
	var ObjectId = require("mongodb").ObjectId;
	
	app.route("/")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/index.html");	
		})
		.post(function (req, res) {
			if (req.body.id) {
				var files = db.collection("files");
				files.find({"_id": ObjectId(req.body.id)}).toArray(function (err, docs) {
					res.send(docs);	
				});
			}	
		});
		
	app.route("/all")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/allfiles.html");	
		});
		
	app.route("/my")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/myfiles.html");	
		})
		.post(function (req, res) {
			var files = db.collection("files");
			if (req.body.id) {
				if (req.body.id.substr(0, 4) !== "http")
				files.remove({_id: ObjectId(req.body.id)});
			}
			setTimeout(function () {
				files.find().toArray(function (err, docs) {
					res.send(docs);	
				});	
			}, 250);
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
		
	app.route("/itunes")
		.post(function (req, res) {
			var title = JSON.parse(req.body.title);
			console.log(title[1]);
			var artist = req.body.artist;
			if (title[1] === "song") {
				var searchParams = {
					entity: 'song',
					country: 'US',
					term: title[0] + " " + artist,
					limit: 1
				};
				
				searchItunes(searchParams, function (err, data) {
					if (err) {
					    console.log (err);
					    res.send(err);
					}
					var data_info = {
						type: "song",
						artist: data.results[0].artistName,
						title: data.results[0].trackName,
						image: data.results[0].artworkUrl100,
						preview: data.results[0].previewUrl
					};
					console.log(data_info.artist + ": " + data_info.title);
					
					var files = db.collection("files");
					files.insert(data_info);
					res.send("success");
				});
			}
			else if (title[1] === "album") {
				var searchParams = {
					entity: 'album',
					country: 'US',
					term: title[0] + " " + artist,
					limit: 1
				};
				
				searchItunes(searchParams, function (err, data) {
					if (err) {
					    console.log (err);
					    res.send(err);
					}
					var data_info = {
						type: "album",
						artist: data.results[0].artistName,
						title: data.results[0].collectionName,
						image: data.results[0].artworkUrl100,
					};
					console.log(data_info.artist + ": " + data_info.title);
					
					var files = db.collection("files");
					files.insert(data_info);
					console.log(data.results[0].artistName + ": " + data.results[0].collectionName);
					res.send("success");
				});
			}
		});
		
};