'use strict';

var header1 = '<div class="row"><div class="col-xs-1"></div><div class="left-head col-xs-1">';
header1 += '<a class="header-site" href="/"><p class="header-site">.mp3trade</p></a></div>';
header1 += '<div class="left-head col-xs-1"><a class="header-home" href="/"><p class="header-home">Home</p></a>';
header1 += '</div><div class="col-xs-4"></div><div class="right-head col-xs-1"><a class="header-all" href="/all">';
header1 += '<p class="header-all">All Books</p></a></div><div class="right-head col-xs-1">';
header1 += '<a class="header-my" href="/my"><p class="header-my">My Books</p></a></div>';
header1 += '<div class="right-head col-xs-1"><a class="header-settings" href="/settings">';
header1 += '<p class="header-settings"><i class="fa fa-cog" aria-hidden="true"></i></p></a>';
header1 += '</div><div class="right-head col-xs-1"><a class="header-logout" href=#><p class="header-logout">';
header1 += '<i class="fa fa-power-off" aria-hidden="true"></i></p></a></div><div class="col-xs-1"></div></div></div>';

var header2 = '<div class="row"><div class="col-xs-1"></div><div class="left-head col-xs-1">';
header2 += '<a class="header-site" href="/"><p class="header-site">.mp3trade</p></a></div>';
header2 += '<div class="left-head col-xs-1"><a class="header-home" href="/"><p class="header-home">Home</p></a>';
header2 += '</div><div class="col-xs-6"></div><div class="right-head col-xs-1"><a class="header-signup" href="/signup">';
header2 += '<p class="header-signup">Signup</p></a></div><div class="right-head col-xs-1">';
header2 += '<a class="header-login" href="/login"><p class="header-login">Login</p></a></div><div class="col-xs-1></div></div>';

$(document).ready(function () {
   if (window.location.href == "https://mp3trade-bartowski20.c9users.io/") {
       $("#header").html(header1);
       $(".header-home").css({"background-color": "darkgray"});
   } 
   
   else if (window.location.href == "https://mp3trade-bartowski20.c9users.io/all") {
       $("#header").html(header1);
       $(".header-all").css({"background-color": "darkgray"});
   }
   
    else if (window.location.href == "https://mp3trade-bartowski20.c9users.io/my") {
       $("#header").html(header1);
       $(".header-my").css({"background-color": "darkgray"});
   } 
   
   else if (window.location.href == "https://mp3trade-bartowski20.c9users.io/signup") {
       $("#header").html(header2);
       $(".header-signup").css({"background-color": "darkgray"});
   } 
   
   else if (window.location.href == "https://mp3trade-bartowski20.c9users.io/login") {
       $("#header").html(header2);
       $(".header-login").css({"background-color": "darkgray"});
   } 
   
   else if (window.location.href == "https://mp3trade-bartowski20.c9users.io/settings") {
       $("#header").html(header1);
       $(".header-settings").css({"background-color": "darkgray"});
   } 
});