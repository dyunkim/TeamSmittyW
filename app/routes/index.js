'use strict';

module.exports = function (app, db) {
	var searchItunes = require("searchitunes");
	var ObjectId = require("mongodb").ObjectId;
	var passport = require("passport");
	
	app.route("/")
		.get(function (req, res) {
			console.log(JSON.stringify(req.user));
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
		})
		
		.post(function (req, res) {
			var files = db.collection("files");
			files.find().toArray(function (err, docs) {
				console.log(docs);
				var obj = {docs: docs, user: ""};
				if (req.user) 
					obj.user = req.user["_id"];
				//console.log("aha " + JSON.stringify(obj));
				res.send(obj);
			});
		});
		
		
	app.route("/my")
		.get(function (req, res) {
			if (req.user) {
				console.log(req.user);
			}
			res.sendFile(process.cwd() + "/public/myfiles.html");		
		})
		
		.post(function (req, res) {
			var userID = req.body.userID;
			var files = db.collection("files");
			if (req.body.id) {
				var fileID = req.body.id;
				
				// pull file of type song
				if (fileID.substr(0, 4) === "song") {
					fileID = fileID.substr(4, fileID.length);
					files.find({_id: ObjectId(userID)}).toArray(function (err, docs) {
					//	console.log("docs" + JSON.stringify(docs));
						for (var i=0; i<docs[0].songs.length; i++) {
							if (docs[0].songs[i]["id"] == fileID) {
								files.update({_id: ObjectId(userID)}, {$pull: {songs: docs[0].songs[i]}});
								break;
							}
						}
					});
				}
				
				// pull file of type album
				else {
					fileID = fileID.substr(5, fileID.length);
					files.find({_id: ObjectId(userID)}).toArray(function (err, docs) {
						for (var j=0; j<docs[0].albums.length; j++) {
							if (docs[0].albums[j].id == fileID) {
								files.update({_id: ObjectId(userID)}, {$pull: {albums: docs[0].albums[j]}});
								break;
							}
						}
					});
				}
			}
			
			// wait for removal, then send updated data to be displayed
			setTimeout(function () {
				console.log(userID);
				files.find({_id: ObjectId(userID)}).toArray(function (err, docs) {
					res.send(docs);	
				});	
			}, 250);
		});
		
		
	app.route("/settings")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/settings.html");	
		})
		
		.post(function (req, res) {
			var userID = req.body.userID;
			console.log(userID);
			var data = {};
			if (req.body.name.length > 1) {
				data.name = req.body.name;
			}
			if (req.body.city.length > 1) {
				data.city = req.body.city;
			}
			if (req.body.state.length > 1) {
				data.state = req.body.state;
			}
			var clients = db.collection("clients");
			clients.update({"_id": ObjectId(userID)}, {$set: {name: data.name, city: data.city, state: data.state}});
			res.send("success");
		});
		
	app.route("/signup")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/signup.html");	
		})
		.post(function (req, res) {
			var clients = db.collection("clients");
			clients.insert({email: req.body.email, pass: req.body.pass, name: req.body.name});
			res.send("ok");
		});
		
	app.route("/login")
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/login.html");	
		});
		
	
	app.post("/auth", passport.authenticate('local', {failureRedirect: '/login'}), function (req, res) {
		res.redirect("/my");
	});
                         	
   
	app.route("/logout") 
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});	
		
		
	app.route("/itunes")
		.post(function (req, res) {
			var title = JSON.parse(req.body.title);
			var userID = req.body.userID;
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
				//	console.log(JSON.stringify(data));
					var data_info = {
						id: data.results[0].trackId,
						artist: data.results[0].artistName,
						title: data.results[0].trackName,
						image: data.results[0].artworkUrl100,
						preview: data.results[0].previewUrl
					};
					console.log(data_info.artist + ": " + data_info.title);
					
					var files = db.collection("files");
					files.find({_id: ObjectId(userID), songs: {$elemMatch: data_info}}).toArray(function (err, docs) {
						if (docs.length === 0) {
						//	console.log(data_info);
							files.update({_id: ObjectId(userID)}, {$push: {songs: data_info}}, {upsert: true});
							res.send("success");
						}
						else {
							res.send("duplicate");
						}
					});
					
					
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
					if (!data) {
						res.send("no data");
						return;
					}
					var data_info = {
						id: data.results[0].collectionId,
						artist: data.results[0].artistName,
						title: data.results[0].collectionName,
						image: data.results[0].artworkUrl100,
					};
					console.log(data_info.artist + ": " + data_info.title);
					
					var files = db.collection("files");
					files.find({_id: ObjectId(userID), albums: {$elemMatch: data_info}}).toArray(function (err, docs) {
						if (docs.length === 0) {
							files.update({_id: ObjectId(userID)}, {$push: {albums: data_info}}, {upsert: true});
							res.send("success");
						}
						else {
							res.send("duplicate");
						}
					});
				});
			}
		});
		
		
	app.get("/user", function (req, res) {
			res.send(req.user);
	});
		
	app.post("/pass", function (req, res) {
		var oldPass = req.body.oldPass;
		var newPass = req.body.newPass;
		var clients = db.collection("clients");
		clients.find({"_id": ObjectId(req.body.userID)}).toArray(function (err, docs) {
			if (docs[0].pass === oldPass) {
				clients.update({"_id": ObjectId(req.body.userID)}, {$set: {pass: newPass}});
				res.send("success");
			}
			else {
				res.send("invalid");
			}
		});
	});
	
	
	app.post("/newtrade", function (req, res) {
		var ownerID = req.body.owner;
		var requesterID = req.body.requester;
		var songID = req.body.song;
		var files = db.collection("files");
		files.update({"_id": ObjectId(ownerID)}, {$push: {inRequests: {requester: requesterID, song: songID}}}, {upsert: true});
		files.update({"_id": ObjectId(requesterID)}, {$push: {outRequests: {owner: ownerID, song: songID}}}, {upsert: true});
		res.send("ok");
	});
	
	app.post("/mytrades", function (req, res) {
		var userID = req.body.userID;
		var files = db.collection("files");
		files.find({"_id": ObjectId(userID)}).toArray(function (err, docs) {
			res.send(docs);	
		});
	});
		
		
	app.get("/delete", function (req, res) {
		var clients = db.collection("clients");
		clients.drop();
		var files = db.collection("files");
		files.drop();
		res.send("all over");
	});
		
};