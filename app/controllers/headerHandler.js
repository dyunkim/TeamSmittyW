'use strict';

var header1 = '<div class="row"><div class="col-xs-1"></div><div class="left-head col-xs-1">';
header1 += '<a class="header-site" href="/"><p class="header-site">.mp3trade</p></a></div>';
header1 += '<div class="left-head col-xs-1"><a class="header-home" href="/"><p class="header-home">Home</p></a>';
header1 += '</div><div class="col-xs-4"></div><div class="right-head col-xs-1"><a class="header-all" href="/all">';
header1 += '<p class="header-all">All Files</p></a></div><div class="right-head col-xs-1">';
header1 += '<a class="header-my" href="/my"><p class="header-my">My Files</p></a></div>';
header1 += '<div class="right-head col-xs-1"><a class="header-settings" href="/settings">';
header1 += '<p class="header-settings"><i class="fa fa-cog" aria-hidden="true"></i></p></a>';
header1 += '</div><div class="right-head col-xs-1"><a class="header-logout" href="/logout"><p class="header-logout">';
header1 += '<i class="fa fa-power-off" aria-hidden="true"></i></p></a></div><div class="col-xs-1"></div></div></div>';

var header2 = '<div class="row"><div class="col-xs-1"></div><div class="left-head col-xs-1">';
header2 += '<a class="header-site" href="/"><p class="header-site">.mp3trade</p></a></div>';
header2 += '<div class="left-head col-xs-1"><a class="header-home" href="/"><p class="header-home">Home</p></a>';
header2 += '</div><div class="col-xs-6"></div><div class="right-head col-xs-1"><a class="header-signup" href="/signup">';
header2 += '<p class="header-signup">Signup</p></a></div><div class="right-head col-xs-1">';
header2 += '<a class="header-login" href="/login"><p class="header-login">Login</p></a></div><div class="col-xs-1></div></div>';

$(document).ready(function () {
   $.ajax({
       type: "GET",
       url: "/user",
       error: function (err) {window.location = "/"},
       success: headers
   });
});


function headers (data) {
    if (window.location.href == "https://mp3trade.herokuapp.com/") {
       if (data["_id"]) {
            $("#header").html(header1);
        }
        else {
            $("#header").html(header2);
        }
        $(".header-home").css({"background-color": "darkgray"});
    } 
   
    else if (window.location.href == "https://mp3trade.herokuapp.com/all") {
        if (data["_id"]) {
            $("#header").html(header1);
            $(".header-all").css({"background-color": "darkgray"});
        }
        else {
            $("#header").html(header2);
        }
    }
   
    else if (window.location.href == "https://mp3trade.herokuapp.com/my") {
       $("#header").html(header1);
       $(".header-my").css({"background-color": "darkgray"});
    } 
   
    else if (window.location.href == "https://mp3trade.herokuapp.com/signup") {
       $("#header").html(header2);
       $(".header-signup").css({"background-color": "darkgray"});
    } 
   
    else if (window.location.href == "https://mp3trade.herokuapp.com/login") {
       $("#header").html(header2);
       $(".header-login").css({"background-color": "darkgray"});
    } 
   
    else if (window.location.href == "https://mp3trade.herokuapp.com/settings") {
       $("#header").html(header1);
       $(".header-settings").css({"background-color": "darkgray"});
    } 
}