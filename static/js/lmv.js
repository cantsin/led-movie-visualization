/* jshint esnext:true */
/* global document, setTimeout, PIXI */

let width = 640;
let height = 400;

let video = $('#video')[0];
video.autoplay = 'autoplay';
video.loop = 'loop';
video.muted = 'muted';
video.controls = true;
video.width = width;
video.height = height;

let canvas = $('#player');
canvas.attr('width', width);
canvas.attr('height', height);

let context = canvas[0].getContext('2d');
context.fillStyle = '#000000';
context.fillRect(0, 0, width, height);
context.fillStyle = '#ffffff';
context.font = 'bold 16px Arial';
context.fillText('No video selected.', width/3, height/2);

// hard-coded for now
let led_width = 150;
let led_height = 90;
let gap = Math.floor(width/led_width/2);

// off-screen buffer, of sorts
let backing = document.createElement('canvas');
backing.width = led_width;
backing.height = led_height;
let backing_context = backing.getContext('2d');

video.addEventListener('play', function() {
  context.fillStyle = '#000000';
  context.fillRect(0, 0, width, height);
  // add an callback to render video to canvas.
  let callback = function() {
    if(video.paused || video.ended) {
      return;
    }

    // draw video offscreen
    backing_context.drawImage(video, 0, 0, led_width, led_height);
    let data = backing_context.getImageData(0, 0, led_width, led_height).data;

    // retrieve video pixels and display in a grid
    var x_index = 20;
    var y_index = 20;
    for(let j=0; j<led_height; j++) {
      for(let i=0; i<led_width; i++) {
        let p = 4 * (j * led_width + i);
        let r = data[p + 0];
        let g = data[p + 1];
        let b = data[p + 2];
        context.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        context.fillRect(x_index, y_index, gap, gap);
        x_index += gap*2;
      }
      x_index = 20;
      y_index += gap*2;
    }

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
