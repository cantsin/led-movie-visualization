/* jshint esnext:true */
/* global document, setTimeout, PIXI */

let width = 320;
let height = 240;

let video = document.createElement('video');
video.autoplay = 'autoplay';
video.loop = 'loop';
video.muted = 'muted';
video.controls = true;

let canvas = $('#player');
canvas.attr('width', width);
canvas.attr('height', height);

let context = canvas[0].getContext('2d');

video.addEventListener("play", function() {
  // add an callback to render video to canvas.
  let callback = function() {
    if(video.paused) {
      return;
    }
    context.drawImage(video, 0, 0, width, height);
    setTimeout(() => { callback(); }, 0);
  };
  callback();
}, false);

let stage = new PIXI.Stage('0xcccccc');
let buff8 = new Uint8ClampedArray(width * height);

$("a.movies").click(function() {
  let name = 'movies/' + $(this).data('movie');
  video.src = name;
  video.play();
});

$(".resume").click(() => {
  if(!video.src) {
    alert("No video selected.");
  } else {
    video.paused = false;
    $(".control").toggle();
  }
});
$(".play").click(() => {
  video.paused = true;
  $(".control").toggle();
});
