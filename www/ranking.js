// Rex Rush — top-10 ranking with persistent storage (c) 2026, MIT.
// On iOS it uses Capacitor Preferences (UserDefaults); in a browser, localStorage.
(function (root) {
  'use strict';
  var KEY = 'rexrush.top10';
  var MAX = 10;

  // Returns { list, rank } — rank is the 1-based position, or 0 if not in the top 10.
  function addScore(list, score, date) {
    var entry = { score: Math.max(0, Math.floor(score)), date: date };
    var next = (list || []).concat([entry]).sort(function (a, b) {
      return b.score - a.score || (a.date < b.date ? -1 : 1);
    }).slice(0, MAX);
    return { list: next, rank: next.indexOf(entry) + 1 };
  }

  function parse(raw) {
    try {
      var v = JSON.parse(raw);
      return Array.isArray(v) ? v.filter(function (e) { return e && typeof e.score === 'number'; }).slice(0, MAX) : [];
    } catch (e) { return []; }
  }

  function prefs() {
    var cap = root.Capacitor;
    return cap && cap.isNativePlatform && cap.isNativePlatform() && cap.Plugins && cap.Plugins.Preferences;
  }

  function load() {
    var p = prefs();
    if (p) return p.get({ key: KEY }).then(function (r) { return parse(r.value); });
    try { return Promise.resolve(parse(root.localStorage.getItem(KEY))); } catch (e) { return Promise.resolve([]); }
  }

  function save(list) {
    var raw = JSON.stringify(list), p = prefs();
    if (p) return p.set({ key: KEY, value: raw });
    try { root.localStorage.setItem(KEY, raw); } catch (e) { /* storage unavailable */ }
    return Promise.resolve();
  }

  var api = { addScore: addScore, parse: parse, load: load, save: save, MAX: MAX };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RexRanking = api;
})(typeof window !== 'undefined' ? window : globalThis);
