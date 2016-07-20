'use strict';

var audio = "";
var oldID = "";

$(document).ready(function () {
    
    // list files on page load
    $.ajax({
        type: "POST",
        url: "/my",
        error: errHandler,
        success: listFiles
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
        var id = event.target.id;
        if (id.length > 0 && id.substr(0, 4) !== "http" && id.substr(0, 6) !== "option" && id !== "myfiles") {
            if (audio.length > 0) {
                audio.pause();
                audio = "";
            }
            
            $.ajax({
                type: "POST",
                url: "/my",
                data: {id: id},
                error: errHandler,
                success: listFiles
            });
        }
       
    });
});


function listFiles (data) {
    if (window.location.href === "https://mp3trade-bartowski20.c9users.io/my") {
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
        for (var i = 0; i < data.length; i++) {
             if (data[i].type === "song") {
                html4 = '"></div><div class="col-xs-8"><p class="file-title-song"';
                html5 = '</p><p class="file-artist-song"';
            }
            else {
                html4 = '"></div><div class="col-xs-8"><p class="file-title-album">';
                html5 = '</p><p class="file-artist-album">';
            }
            var title = data[i].title;
            var artist = data[i].artist;
            if (title.length > 16) {
                title = title.substr(0, 15) + "...";
            }
            if (artist.length > 16) {
                artist = artist.substr(0, 15) + "...";
            }
            if (data[i].type === "song") {
                if (htmlSongs[1] % 4 === 0) {
                    htmlSongs[0] += '<div class="row file-row">' + html1 + data[i]["_id"] + html2.substr(0,17) + ' end-col' + html2.substr(17, html2.length);
                    htmlSongs[0] += data[i]["_id"] + html3 + data[i]["image"] + html4 + ' id="name' + i + '">' + title;
                    htmlSongs[0] += html5 + ' id="artist' + i + '">' + artist + html6 + data[i]["preview"] + '" id="option' + i + '"' + html7;
                }
                else {
                    htmlSongs[0] += html1 + data[i]["_id"] + html2;
                    htmlSongs[0] += data[i]["_id"] + html3 + data[i]["image"] + html4 + ' id="name' + i + '">' + title;
                    htmlSongs[0] += html5 + ' id="artist' + i + '">' + artist + html6 + data[i]["preview"] + '" id="option' + i + '"' + html7;
                    if ((htmlSongs[1]+1) % 4 === 0) {
                        htmlSongs[0] += "</div>";
                    }
                }
                htmlSongs[1]++;
            }
            else {
                if (htmlAlbums[1] % 4 === 0) {
                    htmlAlbums[0] += '<div class="row file-row">' + html1 + data[i]["_id"] + html2.substr(0,17) + ' end-col' + html2.substr(17, html2.length);
                    htmlAlbums[0] += data[i]["_id"] + html3 + data[i]["image"] + html4 + title + html5 + artist + '</p></div></div></div>';
                }
                else {
                    htmlAlbums[0] += html1 + data[i]["_id"] + html2;
                    htmlAlbums[0] += data[i]["_id"] + html3 + data[i]["image"] + html4 + title + html5 + artist + '</p></div></div></div>';
                    if ((htmlAlbums[1]+1) % 4 === 0) {
                        htmlAlbums[0] += "</div>";
                    }
                }
                htmlAlbums[1]++;
            }
            if (i+1 == data.length) {
                htmlSongs[0] += '</div>';
                htmlAlbums[0] += '</div>';
            }
        }
    }
    
    else if (window.location.href === "https://mp3trade-bartowski20.c9users.io/all") {
        var html1 = '<div id="btn';
        var html2 = '" class="col-xs-2">';
        var html3 = '<div class="row file-info"><div class="col-xs-4"><img class="file-img" src="';
        var html4;
        var html5;
        var html6 = '</p><button class="play btn btn-default" value="';
        var html7 = '><i class="fa fa-play play-text" aria-hidden="true"></i></button></div></div></div>';
        
        var htmlSongs = ["", 0];
        var htmlAlbums = ["", 0];
        for (var i = 0; i < data.length; i++) {
             if (data[i].type === "song") {
                html4 = '"></div><div class="col-xs-8"><p class="file-title-song"';
                html5 = '</p><p class="file-artist-song"';
            }
            else {
                html4 = '"></div><div class="col-xs-8"><p class="file-title-album">';
                html5 = '</p><p class="file-artist-album">';
            }
            var title = data[i].title;
            var artist = data[i].artist;
            if (title.length > 16) {
                title = title.substr(0, 15) + "...";
            }
            if (artist.length > 16) {
                artist = artist.substr(0, 15) + "...";
            }
            if (data[i].type === "song") {
                if (htmlSongs[1] % 4 === 0) {
                    htmlSongs[0] += '<div class="row file-row">' + html1 + data[i]["_id"] + html2.substr(0,17) + ' end-col' + html2.substr(17, html2.length);
                    htmlSongs[0] += html3 + data[i]["image"] + html4 + ' id="name' + i + '">' + title;
                    htmlSongs[0] += html5 + ' id="artist' + i + '">' + artist + html6 + data[i]["preview"] + '" id="option' + i + '"' + html7;
                }
                else {
                    htmlSongs[0] += html1 + data[i]["_id"] + html2;
                    htmlSongs[0] += html3 + data[i]["image"] + html4 + ' id="name' + i + '">' + title;
                    htmlSongs[0] += html5 + ' id="artist' + i + '">' + artist + html6 + data[i]["preview"] + '" id="option' + i + '"' + html7;
                    if ((htmlSongs[1]+1) % 4 === 0) {
                        htmlSongs[0] += "</div>";
                    }
                }
                htmlSongs[1]++;
                
            }
            else {
                if (htmlAlbums[1] % 4 === 0) {
                    htmlAlbums[0] += '<div class="row file-row">' + html1 + data[i]["_id"] + html2.substr(0,17) + ' end-col' + html2.substr(17, html2.length);
                    htmlAlbums[0] += html3 + data[i]["image"] + html4 + title + html5 + artist + '</p></div></div></div>';
                }
                else {
                    htmlAlbums[0] += html1 + data[i]["_id"] + html2;
                    htmlAlbums[0] += html3 + data[i]["image"] + html4 + title + html5 + artist + '</p></div></div></div>';
                    if ((htmlAlbums[1]+1) % 4 === 0) {
                        htmlAlbums[0] += "</div>";
                    }
                }
                htmlAlbums[1]++;
            }
            
            if (i+1 == data.length) {
                htmlSongs[0] += '</div>';
                htmlAlbums[0] += '</div>';
            }
        }
    }
    $("#myfiles-songs").html(htmlSongs[0]);
    $("#myfiles-albums").html(htmlAlbums[0]);
}


function  errHandler (err) {
    //alert(JSON.stringify(err));
}