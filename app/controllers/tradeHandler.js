'use strict';

var userID = '';
var displayPending = false;
var displayMy = false;

$(document).ready(function () {
   
   $.ajax({
      type: "GET",
      url: "/user",
      success: function (data) {
         if (data["_id"])
            userID = data["_id"];
      }
   });
   
   // user clicks on request button
   $("#allfiles").on("click", ".unseen", function (event) {
      var ownerID = event.currentTarget.id; 
      var requesterID;
      $.ajax({
         type: "GET",
         url: "/user",
         success: function (data) {
            if (data["_id"]) {
               requesterID = data["_id"];
               $.ajax({
                  type: "POST",
                  url: "/newtrade",
                  data: {requester: requesterID, owner: ownerID.substr(0, 24), file: ownerID.substr(24, ownerID.length)},
                  success: function (data) {
                     if (data == "file no longer exists") {
                        alert("Error requesting file: Owner deleted file from catalogue.");
                     }
                     alert("MP3 Successfully Requested!");
                  }
               })
            }
         }
      });
   });
   
   
   // user checks pending requests
   $("#other-requests").on("click", function () {
      $.ajax({
         type: "POST",
         url: "/mytrades",
         data: {userID: userID},
         success: function (data) {
            displayMy = true;
            displayOutgoing(data);
            displayIncoming(data);
         }
      });
   });
   
   
   // user checks sent requests
   $("#my-requests").on("click", function () {
      $.ajax({
         type: "POST",
         url: "/myrequests",
         data: {userID: userID},
         success: function (data) {
            displayPending = true;
            displayIncoming(data);
            displayOutgoing(data);
         }
      });
   });
   
   
   // user (requester) cancels request
   $("#outgoing").on("click", ".cancel", function (event) {
      var id = event.currentTarget.id.substr(6, event.currentTarget.id.length);
      $.ajax({
         type: "POST",
         url: "/myrequests",
         data: {userID: userID, index: id},
         success: function (data) {
            displayMy = false;
            displayOutgoing(data);
         }
      });
   });
   
   
   // owner completes (or denies) request
   $("#incoming").on("click", ".complete", function (event) {
      var id = event.currentTarget.id.substr(8, event.currentTarget.id.length);
      $.ajax({
         type: "POST",
         url: "/mytrades",
         data: {userID: userID, index: id},
         success: function (data) {
            displayPending = false;
            displayIncoming(data);
         }
      });
   });
   
});



function displayIncoming (data) {
   var html = "";
   if (!displayPending) {
      if (data[0]) {
         if (!data[0].inRequests) {
            $("#incoming").html("<p class='nothingtext'>Looks like nothing is here!</p>");
            displayPending = true;
         }
         else if (data[0].inRequests.length === 0) {
            $("#incoming").html("<p class='nothingtext'>Looks like nothing is here!</p>");
            displayPending = true;
         }
         else {
            for (var i = 0; i < data[0].inRequests.length; i++) {
               var title = data[0].inRequests[i]["title"];
               var artist = data[0].inRequests[i]["artist"];
               var requester = data[0].inRequests[i]["email"];
               
               html += '<div class="row request-item"><div class="col-xs-4"><p class="request-title"><span class="highlight">' + requester + '</span> requests ';
               html += '"' + artist + ":  " + title + '"' + '</p></div>';
               html += '<button class="btn btn-default complete" id="complete' + i + '"><i class="fa fa-times" aria-hidden="true"></i></button>';
               html +=  '</div>';
               displayPending = true;
            }
            $("#incoming").html(html);
         }
      }
      else {
         $("#incoming").html("<p class='nothingtext'>Looks like nothing is here!</p>");
         displayPending = true;
      }
   }
   else {
      displayPending = false;
       $("#incoming").html(html);
   }
}


function displayOutgoing (data) {
   var html = "";
   if (!displayMy) {
      if (!data[0]) {
         $("#incoming").html("<p class='nothingtext'>Looks like nothing is here!</p>");
         displayMy = true;
         return;
      }
      if (!data[0].outRequests) {
         $("#outgoing").html("<p class='nothingtext'>Looks like nothing is here!</p>");
         displayMy = true;
      }
      else if (data[0].outRequests.length === 0) {
         $("#outgoing").html("<p class='nothingtext'>Looks like nothing is here!</p>");
         displayMy = true;
      }
      else {
         for (var i = 0; i < data[0].outRequests.length; i++) {
            var title = data[0].outRequests[i]["title"];
            var artist = data[0].outRequests[i]["artist"];
            
            html += '<div class="row request-item"><div class="col-xs-3"><p class="request-title">' + artist + ":  " + title + '</p>';
            html += '</div><button class="cancel btn btn-default" id="cancel' + i + '"><i class="fa fa-times" aria-hidden="true"></i></button></div>';
            displayMy = true;
         }
         $("#outgoing").html(html);
      }
   }
   else {
      displayMy = false;
       $("#outgoing").html(html);
   }
}