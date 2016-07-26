'use strict';

$(document).ready(function () {
   
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
               alert("requester: " + requesterID + " owner: " + ownerID.substr(0, 24) + " song id: " + ownerID.substr(24, ownerID.length));
               $.ajax({
                  type: "POST",
                  url: "/newtrade",
                  data: {requester: requesterID, owner: ownerID.substr(0, 24), song: ownerID.substr(24, ownerID.length)},
                  success: function (data) {
                     alert("success");
                  }
               })
            }
         }
      });
      
      
   });
});