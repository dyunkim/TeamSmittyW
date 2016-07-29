'use strict';

var userID = "";
var audio = "";
var oldID = "";

$(document).ready(function () {
    
    // list myfiles on page load
    $.ajax({
        type: "GET",
        url: "/user",
        success: function (data) {
            if (data["_id"])
                userID = data["_id"];
            if (userID !== "") {
                $.ajax({
                    type: "POST",
                    url: "/my",
                    data: {userID: userID},
                    error: errHandler,
                    success: listMyFiles
                }); 
            }
            else {
                window.location = "/";
            }
        }
    });


    
     //play MP3 song preview
    $("#myfiles-songs").on("click", ".play", function (event) {
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
    $("#myfiles-songs").on("click", ".playing", function () {
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
    
    
    //remove file and redraw
    $("#myfiles").on("click", function (event) {
        var fileID = event.target.id;
        if (fileID.length > 0 && fileID.substr(0, 6) !== "option" && fileID !== "myfiles") {
            if (audio.length !== 0) {
                audio.pause();
                audio = "";
            }
            
            $.ajax({
                type: "POST",
                url: "/my",
                data: {userID: userID, id: fileID},
                error: errHandler,
                success: listMyFiles
            });
        }
    });
});


function listMyFiles (data) {
        var html1 = '<div id="btn';
        var html2 = '" class="col-xs-2"><button id="';
        var html3 = '" class="exit btn bt-danger"><span>x</span>';
        html3 += '</button><div class="row file-info"><div class="col-xs-4"><img class="file-img" src="';
        var html4;
        var html5;
        var html6 = '</p><button class="play btn btn-default" value="';
        var html7 = '><i class="fa fa-play play-text" aria-hidden="true"></i></button></div></div></div>';
        
        var htmlSongs = ["", 0];
        var htmlAlbums = ["", 0];
        
        // handle songs first
        if (data[0].songs) {
            html4 = '"></div><div class="col-xs-8"><p class="file-title-song"';
            html5 = '</p><p class="file-artist-song"';
            for (var i = 0; i < data[0].songs.length; i++) {
                var title = data[0].songs[i].title;
                var artist = data[0].songs[i].artist;
                if (title.length > 16) {
                    title = title.substr(0, 15) + "...";
                }
                if (artist.length > 16) {
                    artist = artist.substr(0, 15) + "...";
                }
                if (htmlSongs[1] % 4 === 0) {
                    htmlSongs[0] += '<div class="row file-row">' + html1 + i + html2.substr(0,17) + ' end-col' + html2.substr(17, html2.length);
                    htmlSongs[0] += 'song' + data[0].songs[i]["id"] + html3 + data[0].songs[i]["image"] + html4 + ' id="name' + i + '">' + title;
                    htmlSongs[0] += html5 + ' id="artist' + i + '">' + artist + html6 + data[0].songs[i]["preview"] + '" id="option' + i + '"' + html7;
                }
                else {
                    htmlSongs[0] += html1 + i + html2;
                    htmlSongs[0] += 'song' + data[0].songs[i]["id"] + html3 + data[0].songs[i]["image"] + html4 + ' id="name' + i + '">' + title;
                    htmlSongs[0] += html5 + ' id="artist' + i + '">' + artist + html6 + data[0].songs[i]["preview"] + '" id="option' + i + '"' + html7;
                    if ((htmlSongs[1]+1) % 4 === 0) {
                        htmlSongs[0] += "</div>";
                    }
                }
                htmlSongs[1]++;
            }
        }
        
        // then handle albums
        if (data[0].albums) {
            html4 = '"></div><div class="col-xs-8"><p class="file-title-album"';
            html5 = '</p><p class="file-artist-album"';
            for (var j = 0; j < data[0].albums.length; j++) {
                var title = data[0].albums[j].title;
                var artist = data[0].albums[j].artist;
                if (title.length > 16) {
                    title = title.substr(0, 15) + "...";
                }
                if (artist.length > 16) {
                    artist = artist.substr(0, 15) + "...";
                }
                
                if (htmlAlbums[1] % 4 === 0) {
                    htmlAlbums[0] += '<div class="row file-row">' + html1 + j + html2.substr(0,17) + ' end-col' + html2.substr(17, html2.length);
                    htmlAlbums[0] += 'album' + data[0].albums[j]["id"] + html3 + data[0].albums[j]["image"] + html4 + ' id="name' + j + '">' + title;
                    htmlAlbums[0] += html5 + ' id="artist' + j + '">' + artist + '</p></div></div></div>';
                }
                else {
                    htmlAlbums[0] += html1 + j + html2;
                    htmlAlbums[0] += 'album' + data[0].albums[j]["id"] + html3 + data[0].albums[j]["image"] + html4 + ' id="name' + j + '">' + title;
                    htmlAlbums[0] += html5 + ' id="artist' + j + '">' + artist + '</p></div></div></div>';
                    if ((htmlAlbums[1]+1) % 4 === 0) {
                        htmlAlbums[0] += "</div>";
                    }
                }
                htmlAlbums[1]++;
            }
            
        }

    // draw out results to proper div
    $("#myfiles-songs").html(htmlSongs[0]);
    $("#myfiles-albums").html(htmlAlbums[0]);
}
        

function  errHandler (err) {
    alert("ERROR list files " + JSON.stringify(err));
}