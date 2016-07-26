'use strict';

var userID = "";

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/user",
        success: function (data) {
            if (data["_id"]) 
                userID = data["_id"];
            else {
                window.location = "/";
            }
        }
    });
    
    $("#updateinfo").on("click", function () {
        var name = $("#name-input").val(); 
        var city = $("#city-input").val();
        var state = $("#state-input").val();
        $.ajax({
            type: "POST",
            url: "/settings",
            data: {userID: userID, name: name, city: city, state: state},
            success: function (data) {
                alert("Profile successfully updated.");
            }
        });
    });
    
    
    $("#changepass").on("click", function () {
        var oldPass = $("#oldpass-input").val(); 
        var newPass = $("#newpass-input").val();
        $.ajax({
            type: "POST",
            url: "/pass",
            data: {userID: userID, oldPass: oldPass, newPass: newPass},
            success: function (data) {
                if (data === "success")
                    alert("Password successfully changed.");
                else if (data === "invalid") {
                    alert("Sorry, this old password doesn't match our records.");
                }
            }
        });
    });
    
});