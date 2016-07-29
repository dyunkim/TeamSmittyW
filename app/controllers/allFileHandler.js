'use strict';

var audio = "";
var oldID = "";

$(document).ready(function () {
    
    // list myfiles on page load
    setTimeout(function () {
        $.ajax({
            type: "POST",
            url: "/all",
            error: errHandler,
            success: listAllFiles
        }); 
    }, 250);
    
    
     //play MP3 song preview
    $("#allfiles-songs").on("click", ".play", function (event) {
        var id = event.currentTarget.id;
        var nameID = "#name" + id.substr(6, id.length);
        var oldName = "#name" + oldID.substr(6, oldID.length);
        var artistID = "#artist" + id.substr(6, id.length);
        var oldArtist = "#artist" + oldID.substr(6, oldID.length);
        var url = $("#" + id).val();
        if (audio.length === 0) {
            audio = new Audio(url);
            $("#" + id).html('<i class="fa fa-pause" aria-hidden="true"></i>');
            $("#" + id).addClass("playing");
            $("#" + id).removeClass("play");
            $(nameID).addClass("playing-title");
            $(nameID).removeClass("file-title-song");
            $(artistID).addClass("playing-artist");
            $(artistID).removeClass("file-artist-song");
            oldID = id;
            audio.play();
        }
        else {
            // switch to new preview
            if (audio.src !== url) {
                $("#" + oldID).html('<i class="fa fa-play" aria-hidden="true"></i>');
                $("#" + oldID).removeClass("playing");
                $("#" + oldID).addClass("play");
                $(oldName).removeClass("playing-title");
                $(oldName).addClass("file-title-song");
                $(oldArtist).removeClass("playing-artist");
                $(oldArtist).addClass("file-artist-song");
                audio.pause();
                audio = new Audio(url);
                $("#" + id).html('<i class="fa fa-pause" aria-hidden="true"></i>');
                $("#" + id).addClass("playing");
                $("#" + id).removeClass("play");
                $(nameID).addClass("playing-title");
                $(nameID).removeClass("file-title-song");
                $(artistID).addClass("playing-artist");
                $(artistID).removeClass("file-artist-song");
                oldID = id;
                audio.play();
                
            }
        }
    });
    
    // stop playing preview
    $("#allfiles-songs").on("click", ".playing", function () {
        var oldName = "#name" + oldID.substr(6, oldID.length);
        var oldArtist = "#artist" + oldID.substr(6, oldID.length);
        $("#" + oldID).html('<i class="fa fa-play" aria-hidden="true"></i>');
        $("#" + oldID).removeClass("playing");
        $("#" + oldID).addClass("play");
        $(oldName).removeClass("playing-title");
        $(oldName).addClass("file-title-song");
        $(oldArtist).removeClass("playing-artist");
        $(oldArtist).addClass("file-artist-song");
        audio.pause();
        audio = "";
    });
    
});


function listAllFiles (data) {
        if (data.user !== "") {
            var info_text = '<p class="div-text div-text-top">To request a file, click on its corresponding';
            info_text += '<span class="request">Request</span> button.</p><p class="div-text">';
            info_text += 'Your email will be shared with the owner of the file, who can then send the file to you!</p>';
            $("#info").html(info_text);
        }
        var html1 = '<div id="btn';
        var html2 = '" class="col-xs-2">';
        var html3 = '<div class="row file-info"><div class="col-xs-4"><img class="file-img" src="';
        var html4;
        var html5;
        var html6 = '</p><button class="play btn btn-default" value="';
        var html7 = '><i class="fa fa-play play-text" aria-hidden="true"></i></button></div></div></div>';
        
        var htmlSongs = ['', 0];
        var htmlAlbums = ['', 0];
        
        for (var l=0; l < data.docs.length; l++) {
            // handle songs first
            if (data.docs[l].songs) {
                html4 = '"></div><div class="col-xs-8"><p class="file-title-song"';
                html5 = '<p class="file-artist-song"';
                for (var i = 0; i < data.docs[l].songs.length; i++) {
                    var html2A = "";
                    if (data.user !== "" && data.docs[l]["_id"] !== data.user) {
                        var ID = data.docs[l]["_id"] + data.docs[l].songs[i]["id"];
                        html2A = '<button id="' + ID + '" class="unseen"><p class="request">Request</p></button>';
                    }
                    var title = data.docs[l].songs[i].title;
                    var artist = data.docs[l].songs[i].artist;
                    if (title.length > 16) {
                        title = title.substr(0, 15) + "...";
                    }
                    if (artist.length > 16) {
                        artist = artist.substr(0, 15) + "...";
                    }
                    if (htmlSongs[1] % 4 === 0) {
                        htmlSongs[0] += '<div class="row file-row">' + html1 + i + html2.substr(0,17) + ' end-col' + html2.substr(17, html2.length);
                        htmlSongs[0] += html3 + data.docs[l].songs[i]["image"] + html4 + ' id="name' + data.docs[l].songs[i]["id"] + '">' + title + '</p>' + html2A;
                        htmlSongs[0] += html5 + ' id="artist' + data.docs[l].songs[i]["id"] + '">' + artist + html6 + data.docs[l].songs[i]["preview"] + '" id="option';
                        htmlSongs[0] += data.docs[l].songs[i]["id"] + '"' + html7;
                    }
                    else {
                        htmlSongs[0] += html1 + i + html2;
                        htmlSongs[0] += html3 + data.docs[l].songs[i]["image"] + html4 + ' id="name' + data.docs[l].songs[i]["id"] + '">' + title + "</p>" + html2A;
                        htmlSongs[0] += html5 + ' id="artist' + data.docs[l].songs[i]["id"] + '">' + artist + html6 + data.docs[l].songs[i]["preview"] + '" id="option';
                        htmlSongs[0] += data.docs[l].songs[i]["id"] + '"' + html7;
                        if ((htmlSongs[1]+1) % 4 === 0) {
                            htmlSongs[0] += "</div>";
                        }
                    }
                    htmlSongs[1]++;
                }
            }
            
            // then handle albums
            if (data.docs[l].albums) {
                html4 = '"></div><div class="col-xs-8"><p class="file-title-album"';
                html5 = '</p><p class="file-artist-album"';
                for (var j = 0; j < data.docs[l].albums.length; j++) {
                    var html2A = "";
                    if (data.user !== "" && data.docs[l]["_id"] !== data.user) {
                        var ID = data.docs[l]["_id"] + data.docs[l].albums[j]["id"];
                        html2A = '<button id="' + ID + '" class="unseen"><p class="request">Request</p></button>';
                    }
                    var title = data.docs[l].albums[j].title;
                    var artist = data.docs[l].albums[j].artist;
                    if (title.length > 16) {
                        title = title.substr(0, 15) + "...";
                    }
                    if (artist.length > 16) {
                        artist = artist.substr(0, 15) + "...";
                    }
                    
                    if (htmlAlbums[1] % 4 === 0) {
                        htmlAlbums[0] += '<div class="row file-row">' + html1 + j + html2.substr(0,17) + ' end-col' + html2.substr(17, html2.length);
                        htmlAlbums[0] += html3 + data.docs[l].albums[j]["image"] + html4 + ' id="name' + data.docs[l].albums[j]["id"] + '">' + title + '</p>' + html2A;
                        htmlAlbums[0] += html5 + ' id="artist' + data.docs[l].albums[j]["id"] + '">' + artist + '</p></div></div></div>';
                    }
                    else {
                        htmlAlbums[0] += html1 + j + html2;
                        htmlAlbums[0] += html3 + data.docs[l].albums[j]["image"] + html4 + ' id="name' + data.docs[l].albums[j]["id"] + '">' + title;
                        htmlAlbums[0] += '</p>' + html2A + html5 + ' id="artist' + data.docs[l].albums[j]["id"] + '">' + artist + '</p></div></div></div>';
                        if ((htmlAlbums[1]+1) % 4 === 0) {
                            htmlAlbums[0] += "</div>";
                        }
                    }
                    htmlAlbums[1]++;
                }
            }
        }
    // draw out results to proper div
    $("#allfiles-songs").html(htmlSongs[0]);
    $("#allfiles-albums").html(htmlAlbums[0]);
}


function  errHandler (err) {
    alert("ERROR list files " + JSON.stringify(err));
}