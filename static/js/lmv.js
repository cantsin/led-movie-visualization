/* jshint esnext:true */
/* global document, setTimeout, PIXI */

import { rgbToHsl, hslToRgb } from 'js/hsl';

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
clear_display();

let config_lighten = true;
let panels = $('#panels').data('panels');
let led_w = $('#led_data').data('width');
let led_h = $('#led_data').data('height');
let led_width = led_w * panels;
let led_height = led_h * panels;
let gap = Math.floor(width/led_width/2);
reset_spacing(gap);

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
        if(config_lighten) {
          let [h, s, l] = rgbToHsl(r, g, b);
          l *= 1.2;
          let [nr, ng, nb] = hslToRgb(h, s, l);
          context.fillStyle = 'rgb(' + nr + ',' + ng + ',' + nb + ')';
        }
        else {
          context.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        }
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

// poor man's data binding
$('#panel_count').change(function() {
  panels = parseInt($(this).val(), 10);
  led_width = led_w * panels;
  led_height = led_h * panels;
  $('.panels_display').html(panels);
  $('.led_width').html(led_width);
  $('.led_height').html(led_height);
  gap = Math.floor(width/led_width/2);
  reset_spacing(gap);
  clear_display();
});

$('#led_spacing').change(function() {
  gap = parseInt($(this).val(), 10);
  clear_display();
});

$('#lighten').click(function() {
  config_lighten = !config_lighten;
});

function reset_spacing() {
  $('#led_spacing').html('');
  for(let i=1; i<gap+2; i++) {
    $('#led_spacing').append('<option value="' + i + '">' + i + '</option>');
  }
  $('#led_spacing').val(gap);
}

function clear_display() {
  context.fillStyle = '#000000';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#ffffff';
  if(!video.src) {
    context.font = 'bold 16px Arial';
    context.fillText('No video selected.', width/3, height/2);
  }
}
