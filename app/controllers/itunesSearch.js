'use strict';

$(document).ready(function () {
    
    // allow user to press enter after artist entered
    $("#add-artist-input").keyup(function (event) {
        if(event.keyCode == 13){
            $("#add-file").click();
        }
    });
    
    
    // add a new file
    $("#add-file").on("click", function () {
        var url = "/itunes";
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
        var artist = $("#add-artist-input").val();
        $.ajax({
          type: "POST",
          url: url,
          data: {title: JSON.stringify(title), artist: artist},
          error: errHandler,
          success: successHandler
        });
    }); 
});



function errHandler (err) {
    //alert(JSON.stringify(err));
}


function successHandler (data) {
    $.ajax({
        type: "POST",
        url: "/my",
        error: errHandler,
        success: listFiles
    });
}




