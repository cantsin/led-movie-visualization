/* jshint esnext:true */

let width = 320;
let height = 240;

let video = document.createElement('video');
video.autoplay = 'autoplay';
video.loop = 'loop';
video.muted = 'muted';

let canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;

let context = canvas.getContext('2d');

let stage = new PIXI.Stage('0xcccccc');
let buff8 = new Uint8ClampedArray(width*height);

$("a.movies").click(function(_) {
  let name = 'movies/' + $(this).data('movie');
  video.src = name;
});
