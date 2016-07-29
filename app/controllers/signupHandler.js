'use strict';

$(document).ready(function () {
    $("#signup-btn").on("click", function () {
        var name = $("#name-input").val();
        var email = $("#email-input").val();
        var pass = $("#password-input").val();
        $.ajax({
            type: "POST",
            url: "/signup",
            data: {name: name, email: email, pass: pass},
            error: errHandler,
            success: function (data) {
                if (data !== "ok") {
                    $("#flash").html(data);
                }
                else {
                    window.location = "/login";
                }
            }
        }); 
    });
    
    
	$("#password-input").keyup(function (event) {
        if(event.keyCode == 13){
            $("#signup-btn").click();
        }
    });	
});



function errHandler (err) {
    alert("ERROR " + JSON.stringify(err));
}