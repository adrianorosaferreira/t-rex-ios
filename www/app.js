// Rex Rush — screens, sound, ranking and lifecycle around runner.js (c) 2026, MIT.
(function () {
  'use strict';
  var R = window.Runner, runner, top10 = [], started = false, overlayOpen = true, lastEntry = null, actx;
  var $ = function (id) { return document.getElementById(id); };

  // --- Screen fitting: logical width follows the screen's aspect ratio. ---
  R.computeWidth = function (el) {
    return Math.max(480, Math.min(1100, Math.round(150 * el.clientWidth / (el.clientHeight || 1))));
  };
  R.prototype.setArcadeModeContainerScale = function () {
    var el = this.outerContainerEl, d = this.dimensions;
    var s = Math.min(el.clientHeight / d.HEIGHT, el.clientWidth / d.WIDTH);
    var x = (el.clientWidth - d.WIDTH * s) / 2, y = el.clientHeight - d.HEIGHT * s;
    this.containerEl.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
    var st = document.body.style; // ground rows of the canvas: grass 136, dark 137-138, dirt 139-149
    st.setProperty('--dirt', 11 * s + 'px'); st.setProperty('--dark', 13 * s + 'px'); st.setProperty('--grass', 14 * s + 'px');
  };
  ['init', 'adjustDimensions'].forEach(function (m) {
    var orig = R.prototype[m];
    R.prototype[m] = function () { orig.apply(this, arguments); if (this.containerEl) this.setArcadeModeContainerScale(); };
  });

  // --- Own chiptune sound effects (Web Audio), replacing the original audio. ---
  var SFX = { BUTTON_PRESS: ['square', 520, 880, 0.08], SCORE: ['square', 880, 1320, 0.15], HIT: ['sawtooth', 240, 60, 0.3] };
  R.prototype.loadSounds = function () { this.soundFx = { BUTTON_PRESS: 'BUTTON_PRESS', HIT: 'HIT', SCORE: 'SCORE' }; };
  R.prototype.playSound = function (kind) {
    var c = SFX[kind];
    if (!actx || !c) return;
    var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
    o.type = c[0];
    o.frequency.setValueAtTime(c[1], t); o.frequency.exponentialRampToValueAtTime(c[2], t + c[3]);
    g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + c[3]);
    o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + c[3]);
  };
  function unlockAudio() {
    var A = window.AudioContext || window.webkitAudioContext;
    if (!actx && A) actx = new A();
    if (actx && actx.state === 'suspended') actx.resume();
  }

  // --- Input is ignored while a menu/overlay is on screen. ---
  ['onKeyDown', 'onKeyUp'].forEach(function (m) {
    var orig = R.prototype[m];
    R.prototype[m] = function (e) { if (!overlayOpen || e.rexSynthetic) orig.call(this, e); };
  });

  // --- Game over: save the score and show the options. ---
  var origGameOver = R.prototype.gameOver;
  R.prototype.gameOver = function () {
    origGameOver.call(this);
    var score = this.distanceMeter.getActualDistance(Math.ceil(this.distanceRan));
    var res = RexRanking.addScore(top10, score, new Date().toISOString());
    top10 = res.list;
    lastEntry = res.rank ? top10[res.rank - 1] : null;
    RexRanking.save(top10);
    $('go-score').textContent = score;
    $('go-rank').textContent = res.rank === 1 ? 'New record!' : res.rank ? 'Top 10: #' + res.rank : '';
    renderTop();
    setTimeout(function () { show('gameover'); }, 400);
  };

  // --- Pause when the app leaves the foreground; resume only on request. ---
  R.prototype.onVisibilityChange = function (e) {
    var hidden = document.hidden || e.type === 'blur' || document.visibilityState !== 'visible';
    if (hidden && this.playing && !this.crashed) { this.stop(); show('pause'); }
  };

  function show(id) {
    ['intro', 'menu', 'gameover', 'pause'].forEach(function (s) { $(s).hidden = s !== id; });
    overlayOpen = !!id;
  }

  function newGame() {
    unlockAudio();
    show(null);
    if (!started) {
      started = true;
      var ev = function (t) { return { type: t, keyCode: 32, rexSynthetic: true, target: document.body, preventDefault: function () {} }; };
      runner.onKeyDown(ev('keydown'));
      setTimeout(function () { runner.onKeyUp(ev('keyup')); }, 120);
    } else {
      runner.stop();
      runner.paused = false;
      runner.restart();
    }
  }

  function resume() {
    unlockAudio();
    show(null);
    runner.tRex.reset();
    runner.play();
  }

  function renderTop() {
    var ol = $('top10');
    ol.innerHTML = '';
    if (!top10.length) { ol.innerHTML = '<li class="empty">No scores yet. Go run!</li>'; return; }
    top10.forEach(function (e, i) {
      var li = document.createElement('li');
      if (e === lastEntry) li.className = 'new';
      var d = e.date ? new Date(e.date).toLocaleDateString() : '';
      li.innerHTML = '<b>' + (i + 1) + '.</b> <span>' + e.score + '</span> <i>' + d + '</i>';
      ol.appendChild(li);
    });
  }

  function animateMascots(sheet) {
    var cs = document.querySelectorAll('canvas.mascot'), f = 0, T = RexSprites.TREX;
    setInterval(function () {
      f ^= 1;
      for (var i = 0; i < cs.length; i++) {
        var x = cs[i].getContext('2d');
        x.imageSmoothingEnabled = false;
        x.clearRect(0, 0, 44, 47);
        x.drawImage(sheet, T.x + (f ? 88 : 132), T.y, 44, 47, 0, 0, 44, 47);
      }
    }, 160);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sheets = RexSprites.install(R);
    runner = new R('.interstitial-wrapper');
    animateMascots(sheets.ldpi);
    RexRanking.load().then(function (l) { top10 = l; renderTop(); });

    var toMenu = function () { clearTimeout(timer); if (!$('intro').hidden) show('menu'); };
    var timer = setTimeout(toMenu, 3500);
    $('intro').addEventListener('click', toMenu);
    $('btn-new').addEventListener('click', newGame);
    $('btn-again').addEventListener('click', newGame);
    $('btn-continue').addEventListener('click', resume);
    $('btn-menu').addEventListener('click', function () { show('menu'); });
    $('btn-pause-menu').addEventListener('click', function () { show('menu'); });
    // Also listen from the start (runner.js only binds these after the first intro).
    document.addEventListener('visibilitychange', function (e) { runner.onVisibilityChange(e); });
    show('intro');
  });
})();
