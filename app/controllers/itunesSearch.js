'use strict';

var userID = '';

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/user",
        success: function (data) { 
            if (data["_id"]) 
                userID = data["_id"];
            if (userID === "") {
                window.location = "/";
            }
        }
    });
    
    
    
    // allow user to press enter after artist entered
    $("#add-artist-input").keyup(function (event) {
        if(event.keyCode == 13){
            $("#add-file").click();
        }
    });
    
    
    // add a new file
    $("#add-file").on("click", function () {
        var title = [];
        title.push($("#add-title-input").val());
        title.push("song");
        if (title[0].length === 0) {
            title[0] = $("#add-album-input").val();
            title[1] = "album";
            if (title[0].length === 0) {
                alert("Please enter either a song or album title.");
                return;
            }
        }
       // var userID = $("#add-file").val();
        var url = "/itunes";
        var artist = $("#add-artist-input").val();
        $.ajax({
          type: "POST",
          url: url,
          data: {userID: userID, title: JSON.stringify(title), artist: artist},
          error: errHandler,
          success: successHandler
        });
    }); 
});



function errHandler (err) {
    alert("ERROR add file" + JSON.stringify(err));
}


function successHandler (data) {
    if (data === "success") {
       // var userID = $("#add-file").val();
        $.ajax({
            type: "POST",
            url: "/my",
            data: {userID: userID}, 
            error: errHandler,
            success: listMyFiles
        });
    }
    else if (data === "duplicate") {
        alert("You have already catalogued this file!");
    }
    else if (data === "no data") {
        alert("We cannot find a file with the given search parameters, please try again!");
    }
}




