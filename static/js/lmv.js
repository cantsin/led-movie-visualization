/* jshint esnext:true */
/* global document, setTimeout, PIXI */

let width = 320;
let height = 240;

let video = $('#video')[0];
video.autoplay = 'autoplay';
video.loop = 'loop';
video.muted = 'muted';
video.controls = true;
video.width = width;
video.height = height;
video.type = "video/mp4";

let canvas = $('#player');
canvas.attr('width', width);
canvas.attr('height', height);

let context = canvas[0].getContext('2d');
context.fillStyle = '#000000';
context.fillRect(0, 0, width, height);
context.fillStyle = '#ffffff';
context.font = 'bold 16px Arial';
context.fillText('No video selected.', width/4, height/2);

video.addEventListener('play', function() {
  // add an callback to render video to canvas.
  let callback = function() {
    if(video.paused) {
      console.log('video paused.');
      return;
    }
    context.drawImage(video, 0, 0, width, height);
    setTimeout(() => { callback(); }, 0);
  };
  callback();
}, false);

let stage = new PIXI.Stage('0xcccccc');
let buff8 = new Uint8ClampedArray(width * height);

$('a.movies').click(function() {
  let name = 'movies/' + $(this).data('movie');
  video.src = name;
  video.play();
});
