'use strict';

$(document).ready(function () {
   if (window.location.href == "https://mp3trade-bartowski20.c9users.io/") {
       $(".header-home").css({"background-color": "darkgray"});
   } 
   else if (window.location.href == "https://mp3trade-bartowski20.c9users.io/all") {
       $(".header-all").css({"background-color": "darkgray"});
   } 
});