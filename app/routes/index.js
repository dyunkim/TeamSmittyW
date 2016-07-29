'use strict';

module.exports = function (app, db) {
	var searchItunes = require("searchitunes");
	var ObjectId = require("mongodb").ObjectId;
	var passport = require("passport");
	var flash=require("connect-flash");
	var validator = require("validator");
	app.use(flash());
	
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
						if (docs[0].songs) {
							for (var i=0; i<docs[0].songs.length; i++) {
								if (docs[0].songs[i]["id"] == fileID) {
									files.update({_id: ObjectId(userID)}, {$pull: {songs: docs[0].songs[i]}});
									break;
								}
							}
						}
					});
				}
				
				// pull file of type album
				else {
					fileID = fileID.substr(5, fileID.length);
					files.find({_id: ObjectId(userID)}).toArray(function (err, docs) {
						if (docs[0].albums) {
							for (var j=0; j<docs[0].albums.length; j++) {
								if (docs[0].albums[j].id == fileID) {
									files.update({_id: ObjectId(userID)}, {$pull: {albums: docs[0].albums[j]}});
									break;
								}
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
			var data = {};
			if (req.body.name.length > 1) {
				if (validator.isAlphanumeric(req.body.name))
					data.name = req.body.name;
				else {
					res.send("Name");
					return;
				}
			}
			if (req.body.city.length > 1) {
				if (validator.isAlphanumeric(req.body.city))
					data.city = req.body.city;
				else {
					res.send("City");
					return;
				}
			}
			if (req.body.state.length > 1) {
				if (validator.isAlphanumeric(req.body.state))
					data.state = req.body.state;
				else {
					res.send("State");
					return;
				}
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
			if (!validator.isEmail(req.body.email)) {
				res.send("Invalid email.");
			}
			else {
				clients.find({email: req.body.email}).toArray(function (err, docs) {
					if (docs[0]) {
						res.send("Email already taken: please try again!");
					}
					else {
						var pass = validator.escape(req.body.pass);
						clients.insert({email: req.body.email, pass: pass, name: req.body.name});
						res.send("ok");
					}
				});
				
			}
		});
		
	app.route("/login")
		.get(function (req, res) {
			res.render(process.cwd() + "/public/login.pug", { message: req.flash('error')});
		});
		
	
	app.post("/auth", passport.authenticate('local', {failureRedirect: '/login', successRedirect: "/my", failureFlash: true}), function (req, res) {
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
		var newPass = validator.escape(req.body.newPass);
		var clients = db.collection("clients");
		clients.find({"_id": ObjectId(req.body.userID)}).toArray(function (err, docs) {
			console.log(oldPass);
			if (docs[0].pass == validator.escape(oldPass)) {
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
		var fileID = req.body.file;
		var files = db.collection("files");
		var clients = db.collection("clients");
		
		clients.find({"_id": ObjectId(requesterID)}).toArray(function (err, info) {
			var requesterEmail = info[0]["email"];
			console.log(requesterEmail);
			
			files.find({"_id": ObjectId(ownerID)}).toArray(function (err, docs) {
				var name = "";
				var artist = "";
				if (docs[0].songs) {
					for (var i = 0; i < docs[0].songs.length; i++) {
						if (fileID == docs[0].songs[i]["id"]) {
							name = docs[0].songs[i]["title"];
							artist = docs[0].songs[i]["artist"];
							files.update({"_id": ObjectId(ownerID)}, {$push: {inRequests: {requester: requesterID, email: requesterEmail, title: name, artist: artist}}}, {upsert: true});
							files.update({"_id": ObjectId(requesterID)}, {$push: {outRequests: {owner: ownerID, title: name, artist: artist}}}, {upsert: true});
							res.send("ok");
							break;
						}
					}
				}
				
				if (docs[0].albums) {
					for (var j = 0; j < docs[0].albums.length; j++) {
						if (fileID == docs[0].albums[j]["id"]){
							name = docs[0].albums[j]["title"];
							artist = docs[0].albums[j]["artist"];
							files.update({"_id": ObjectId(ownerID)}, {$push: {inRequests: {requester: requesterID, email: requesterEmail, title: name, artist: artist}}}, {upsert: true});
							files.update({"_id": ObjectId(requesterID)}, {$push: {outRequests: {owner: ownerID, title: name, artist: artist}}}, {upsert: true});
							res.send("ok");
							break;
						}
					}
				}
			});
		});
	});
	
	app.post("/myrequests", function (req, res) {
		var userID = req.body.userID;
		var files = db.collection("files");
		if (req.body.index) {
			// remove request from requester's queue
			files.find({"_id": ObjectId(userID)}).toArray(function (err, docs) {
				var outgoing1 = docs[0].outRequests.slice(0, req.body.index);
				var outgoing2 = docs[0].outRequests.slice(eval(req.body.index)+1, docs[0].outRequests.length);
				var outgoing = outgoing1.concat(outgoing2);
				files.update({"_id": ObjectId(userID)}, {$set: {outRequests: outgoing}});
				
				// and queue of song owner so they don't send the file anyway
				var deletedOwner = docs[0].outRequests[req.body.index]["owner"];
				var deletedFile = docs[0].outRequests[req.body.index]["title"];
				files.find({"_id": ObjectId(deletedOwner)}).toArray(function (err, docs) {
					for (var i = 0; i < docs[0].inRequests.length; i++) {
						if (deletedFile == docs[0].inRequests[i]["title"]) {
							var incoming1 = docs[0].inRequests.slice(0, i);
							var incoming2 = docs[0].inRequests.slice(i+1, docs[0].inRequests.length);
							var incoming = incoming1.concat(incoming2);
							files.update({"_id": ObjectId(deletedOwner)}, {$set: {inRequests: incoming}});
							break;
						}
					}
				});
			});
		}
		// retrieve updated files for display
		setTimeout(function () {
			files.find({"_id": ObjectId(userID)}).toArray(function (err, docs) {
				res.send(docs);
			});
		}, 500);
	});
	
	
	
	app.post("/mytrades", function (req, res) {
		var userID = req.body.userID;
		var files = db.collection("files");
		if (req.body.index) {
			// remove request from owner's queue...
			files.find({"_id": ObjectId(userID)}).toArray(function (err, docs) {
				var incoming1 = docs[0].inRequests.slice(0, req.body.index);
				var incoming2 = docs[0].inRequests.slice(eval(req.body.index) + 1, docs[0].inRequests.length);
				var incoming = incoming1.concat(incoming2);
				files.update({"_id": ObjectId(userID)}, {$set: {inRequests: incoming}});
				
				// ...and queue of requester so they don't keep waiting
				var deletedRequester = docs[0].inRequests[req.body.index]["requester"];
				var deletedFile = docs[0].inRequests[req.body.index]["title"];
				files.find({"_id": ObjectId(deletedRequester)}).toArray(function (err, docs) {
					for (var i = 0; i < docs[0].outRequests.length; i++) {
						if (deletedFile == docs[0].outRequests[i]["title"]) {
							var outgoing1 = docs[0].outRequests.slice(0, i);
							var outgoing2 = docs[0].outRequests.slice(i+1, docs[0].outRequests.length);
							var outgoing = outgoing1.concat(outgoing2);
							files.update({"_id": ObjectId(deletedRequester)}, {$set: {outRequests: outgoing}});
							break;
						}
					}
				});
			});
		}
		// lastly retrieve updated files for display
		setTimeout(function () {
			files.find({"_id": ObjectId(userID)}).toArray(function (err, docs) {
				res.send(docs);
			});
		}, 500);
	});
		
};