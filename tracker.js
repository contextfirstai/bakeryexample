// Small, readable logic for the tracker. No framework.
(function (root) {
  var LABELS = { "not-started": "Not started", "in-progress": "In progress", "done": "Done" };
  var KEY_TEXT = "Grey: not started. Blue: in progress. Green: done.";

  function stateLabel(state) {
    if (!LABELS[state]) throw new Error("Unknown state: " + state);
    return LABELS[state];
  }
  function counterText(tiles) {
    var done = tiles.filter(function (t) { return t.state === "done"; }).length;
    return done + " of " + tiles.length + " done";
  }
  function hoursLine(data) { return data.hours || ""; }
  function versionLabel(data) { return data.version || "No release yet"; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function render(data, doc) {
    doc = doc || document;
    doc.getElementById("bakery-name").textContent = data.bakeryName;
    doc.getElementById("headline").textContent = data.headline;
    var hours = doc.getElementById("hours");
    hours.textContent = hoursLine(data);
    hours.hidden = !hoursLine(data);
    doc.getElementById("version").textContent = versionLabel(data);
    doc.getElementById("key").textContent = KEY_TEXT;
    doc.getElementById("counter").textContent = counterText(data.tiles);

    var grid = doc.getElementById("tiles");
    grid.textContent = "";
    data.tiles.forEach(function (t) {
      var tile = el("li", "tile " + t.state);
      tile.appendChild(el("span", "tile-num", String(t.id)));
      tile.appendChild(el("span", "tile-title", t.title));
      tile.appendChild(el("span", "tile-state", stateLabel(t.state)));
      grid.appendChild(tile);
    });
  }

  var api = { stateLabel: stateLabel, counterText: counterText, hoursLine: hoursLine,
              versionLabel: versionLabel, render: render, KEY_TEXT: KEY_TEXT };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Tracker = api;
})(typeof window !== "undefined" ? window : this);
