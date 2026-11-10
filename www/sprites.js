// Rex Rush — original pixel art drawn in code (c) 2026, MIT (see LICENSE).
// Builds a sprite sheet with the same layout runner.js expects (LDPI
// coordinates); the HDPI sheet is a nearest-neighbour 2x copy.
(function () {
  'use strict';
  var C = {
    out: '#1b4d2b', body: '#43c463', light: '#9cf0a8', belly: '#ffd166',
    spike: '#ff5d8f', eye: '#ffffff', pupil: '#14142b', mouth: '#c2185b',
    cactus: '#2ec4b6', cactusDark: '#11695f', flower: '#ff6b6b', flower2: '#ffd23f',
    ptero: '#9b5de5', pteroDark: '#4a1f8a', beak: '#ff9f1c',
    cloud: '#ffffff', cloudShade: '#bde0fe',
    grass: '#70e000', grassDark: '#2b9348', dirt: '#bc6c25', dirtDark: '#8a4b16',
    pebble: '#ffd6a5', moon: '#fff3b0', star: '#ffd23f',
    digit: '#ffd23f', digitOut: '#2b2d42'
  };
  var LDPI = {
    CACTUS_LARGE: { x: 332, y: 2 }, CACTUS_SMALL: { x: 228, y: 2 },
    CLOUD: { x: 86, y: 2 }, HORIZON: { x: 2, y: 54 }, MOON: { x: 484, y: 2 },
    PTERODACTYL: { x: 134, y: 2 }, RESTART: { x: 2, y: 2 },
    TEXT_SPRITE: { x: 655, y: 2 }, TREX: { x: 848, y: 2 }, STAR: { x: 645, y: 2 }
  };
  var W = 2404, H = 80, ctx;

  function r(x, y, w, h, c) { ctx.fillStyle = C[c] || c; ctx.fillRect(x, y, w, h); }
  function at(ox, oy) { return function (x, y, w, h, c) { r(ox + x, oy + y, w, h, c); }; }

  function eye(X, x, y, mode) {
    X(x, y, 5, 5, 'eye');
    if (mode === 'dead') {
      for (var i = 0; i < 5; i++) { X(x + i, y + i, 1, 1, 'pupil'); X(x + 4 - i, y + i, 1, 1, 'pupil'); }
    } else { X(x + 2, y + 1, 2, 3, 'pupil'); }
  }

  function leg(X, x, y, up) {
    X(x, y, 5, up ? 6 : 10, 'out'); X(x + 1, y, 3, up ? 5 : 9, 'body');
    X(x, y + (up ? 4 : 8), 8, 3, 'out');
  }

  // 44x47 standing / running / jumping / crashed rex.
  function dino(ox, oy, legs, eyeMode) {
    var X = at(ox, oy);
    X(0, 13, 3, 5, 'out'); X(0, 17, 12, 8, 'out'); X(1, 18, 11, 6, 'body');
    X(8, 14, 23, 21, 'out'); X(9, 15, 21, 19, 'body'); X(18, 20, 10, 13, 'belly');
    X(5, 15, 3, 3, 'spike'); X(10, 12, 3, 3, 'spike'); X(15, 11, 3, 3, 'spike');
    X(30, 21, 6, 3, 'out'); X(34, 21, 2, 5, 'out');
    X(21, 0, 20, 17, 'out'); X(22, 1, 18, 15, 'body'); X(23, 2, 8, 2, 'light');
    X(30, 11, 11, 2, 'out'); X(32, 13, 8, 2, 'mouth'); X(38, 3, 1, 2, 'out');
    eye(X, 25, 3, eyeMode);
    leg(X, 11, 34, legs === 1); leg(X, 21, 34, legs === 2);
  }

  // 59x47 ducking rex (drawn in the lower part of the frame).
  function duck(ox, oy, legs) {
    var X = at(ox, oy);
    X(0, 24, 12, 7, 'out'); X(1, 25, 11, 5, 'body');
    X(9, 22, 30, 16, 'out'); X(10, 23, 28, 14, 'body'); X(16, 30, 18, 6, 'belly');
    X(14, 20, 3, 3, 'spike'); X(21, 20, 3, 3, 'spike'); X(28, 20, 3, 3, 'spike');
    X(37, 20, 21, 15, 'out'); X(38, 21, 19, 13, 'body'); X(39, 22, 7, 2, 'light');
    X(48, 30, 10, 2, 'out'); X(49, 32, 8, 2, 'mouth');
    eye(X, 43, 23, 'open');
    leg(X, 14, 37, legs === 1); leg(X, 26, 37, legs === 2);
  }

  function cactus(ox, oy, w, h) {
    var X = at(ox, oy), t = w > 20 ? 7 : 5, cx = (w - t) >> 1, a = w > 20 ? 4 : 3;
    function B(x, y, bw, bh) { X(x, y, bw, bh, 'cactusDark'); X(x + 1, y + 1, bw - 2, bh - 2, 'cactus'); }
    var p = function (f) { return Math.round(h * f); };
    B(0, p(.25), a, p(.3)); B(0, p(.55) - a, cx + 1, a);
    B(w - a, p(.35), a, p(.3)); B(cx + t - 1, p(.65) - a, w - a - cx - t + 2, a);
    B(cx, 3, t, h - 3);
    X(cx + 2, p(.3), 1, p(.4), 'light');
    X(cx + 1, 0, t - 2, 3, 'flower'); X(cx + (t >> 1), 1, 1, 1, 'flower2');
  }

  function ptero(ox, oy, up) {
    var X = at(ox, oy);
    if (up) { X(18, 2, 6, 14, 'pteroDark'); X(19, 3, 4, 12, 'ptero'); X(24, 7, 7, 9, 'pteroDark'); X(25, 8, 5, 7, 'ptero'); }
    X(2, 13, 6, 3, 'beak');
    X(10, 6, 8, 4, 'pteroDark');
    X(6, 9, 10, 9, 'pteroDark'); X(7, 10, 8, 7, 'ptero'); X(8, 11, 2, 2, 'eye'); X(8, 12, 1, 1, 'pupil');
    X(14, 15, 22, 9, 'pteroDark'); X(15, 16, 20, 7, 'ptero'); X(20, 19, 10, 3, 'belly');
    X(35, 18, 8, 3, 'pteroDark');
    if (!up) { X(18, 22, 6, 16, 'pteroDark'); X(19, 23, 4, 14, 'ptero'); X(24, 22, 7, 10, 'pteroDark'); X(25, 23, 5, 8, 'ptero'); }
  }

  function cloud(ox, oy) {
    var X = at(ox, oy);
    X(4, 6, 38, 7, 'cloudShade'); X(10, 2, 14, 8, 'cloud'); X(20, 0, 14, 9, 'cloud');
    X(4, 5, 38, 6, 'cloud'); X(8, 11, 30, 2, 'cloudShade');
  }

  function circle(cx, cy, rad, color, cut) {
    ctx.globalCompositeOperation = cut ? 'destination-out' : 'source-over';
    ctx.fillStyle = C[color] || color;
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function moon(ox, oy) {
    var cuts = { 0: -5, 20: -9, 40: -13, 100: 13, 120: 9, 140: 5 };
    Object.keys(cuts).forEach(function (k) {
      var cx = ox + +k + 10, cy = oy + 20;
      circle(cx, cy, 9, 'moon'); circle(cx + cuts[k], cy, 9, '#000', true);
    });
    circle(ox + 80, oy + 20, 17, 'moon');
    r(ox + 72, oy + 12, 4, 4, 'pebble'); r(ox + 84, oy + 24, 6, 5, 'pebble'); r(ox + 76, oy + 28, 3, 3, 'pebble');
  }

  function stars(ox, oy) {
    for (var i = 0; i < 3; i++) {
      var X = at(ox, oy + i * 9);
      X(4, 0, 1, 9, 'star'); X(0, 4, 9, 1, 'star'); X(3, 3, 3, 3, i === 1 ? 'eye' : 'star');
    }
  }

  // 3x5 font: digits 0-9, then H and I (positions 10 and 11 in the strip).
  var FONT = ['111101101101111', '010110010010111', '111001111100111', '111001111001111',
    '101101111001001', '111100111001111', '111100111101111', '111001001001001',
    '111101111101111', '111101111001111', '101101111101101', '111010010010111'];
  function digits(ox, oy) {
    FONT.forEach(function (g, n) {
      [['digitOut', 1, 4], ['digit', 2, 2]].forEach(function (pass) {
        for (var i = 0; i < 15; i++) {
          if (g[i] === '1') r(ox + n * 10 + (i % 3) * 2 + pass[1], oy + ((i / 3) | 0) * 2 + pass[1] - 1, pass[2], pass[2], pass[0]);
        }
      });
    });
  }

  function ground(ox, oy, seg, seed) {
    var X = at(ox, oy), s = seed;
    function rnd() { s = (s * 16807) % 2147483647; return s / 2147483647; }
    X(0, 9, seg, 3, 'grassDark'); X(0, 9, seg, 1, 'grass'); X(0, 12, seg, 11, 'dirt');
    for (var x = 0; x < seg; x += 3) {
      var v = rnd();
      if (v < 0.25) X(x, 7, 1, 2, 'grass');
      if (v > 0.93) { X(x, 6, 1, 3, 'grassDark'); X(x + 1, 5, 1, 4, 'grass'); }
      if (v > 0.6 && v < 0.7) X(x, 13 + ((v * 90) | 0) % 8, 2, 1, 'pebble');
      if (v > 0.45 && v < 0.5) X(x, 14 + ((v * 70) | 0) % 7, 3, 2, 'dirtDark');
    }
  }

  function build() {
    var c = document.createElement('canvas');
    c.width = W; c.height = H; ctx = c.getContext('2d');
    var T = LDPI.TREX;
    dino(T.x, T.y, 0, 'open'); dino(T.x + 44, T.y, 0, 'open');
    dino(T.x + 88, T.y, 1, 'open'); dino(T.x + 132, T.y, 2, 'open');
    dino(T.x + 176, T.y, 0, 'shut'); dino(T.x + 220, T.y, 0, 'dead');
    duck(T.x + 264, T.y, 1); duck(T.x + 323, T.y, 2);
    var off = 0, n, k;
    for (n = 1; n <= 3; n++) {
      for (k = 0; k < n; k++) cactus(LDPI.CACTUS_SMALL.x + off + k * 17, 2, 17, 35);
      off += n * 17;
    }
    for (off = 0, n = 1; n <= 3; n++) {
      for (k = 0; k < n; k++) cactus(LDPI.CACTUS_LARGE.x + off + k * 25, 2, 25, 50);
      off += n * 25;
    }
    ptero(LDPI.PTERODACTYL.x, 2, true); ptero(LDPI.PTERODACTYL.x + 46, 2, false);
    cloud(LDPI.CLOUD.x, 2);
    moon(LDPI.MOON.x, 2);
    stars(LDPI.STAR.x, 2);
    digits(LDPI.TEXT_SPRITE.x, 2);
    ground(LDPI.HORIZON.x, LDPI.HORIZON.y, 1200, 7);
    ground(LDPI.HORIZON.x + 1200, LDPI.HORIZON.y, 1200, 99);

    var c2 = document.createElement('canvas');
    c2.width = W * 2; c2.height = H * 2;
    var x2 = c2.getContext('2d');
    x2.imageSmoothingEnabled = false;
    x2.drawImage(c, 0, 0, W * 2, H * 2);
    return { ldpi: c, hdpi: c2 };
  }

  // Applies the sheet to the <img> tags and sprite layout used by runner.js.
  function install(Runner) {
    var sheets = build();
    var hd = {};
    Object.keys(LDPI).forEach(function (k) { hd[k] = { x: LDPI[k].x * 2, y: LDPI[k].y * 2 }; });
    Runner.spriteDefinition.LDPI = LDPI;
    Runner.spriteDefinition.HDPI = hd;
    document.getElementById('offline-resources-1x').src = sheets.ldpi.toDataURL();
    document.getElementById('offline-resources-2x').src = sheets.hdpi.toDataURL();
    return sheets;
  }

  window.RexSprites = { install: install, TREX: LDPI.TREX };
})();
