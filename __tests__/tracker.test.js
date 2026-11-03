// RED-first tests for CFAI-CLC-TRK-PRD-001 v1.1
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

function loadData() {
  const sandbox = { window: {} };
  vm.runInNewContext(read('data.js'), sandbox);
  return sandbox.window.BAKERY_DATA;
}
const tracker = require('../tracker.js');
const STATES = ['not-started', 'in-progress', 'done'];

test('structure: simplicity files exist (PRD s7, s8)', () => {
  for (const f of ['index.html', 'tracker.html', 'styles.css', 'data.js', 'README.md', '.gitignore', 'settings.example.json']) {
    assert.ok(fs.existsSync(path.join(root, f)), `${f} missing`);
  }
});

test('REQ-TRK-001: exactly 12 tiles, numbered 1..12 with titles', () => {
  const { tiles } = loadData();
  assert.strictEqual(tiles.length, 12);
  tiles.forEach((t, i) => {
    assert.strictEqual(t.id, i + 1);
    assert.ok(t.title && t.title.length > 0);
  });
});

test('PRD s5: tile titles match the 12 steps', () => {
  const titles = [...loadData().tiles.map((t) => t.title)];
  assert.deepStrictEqual(titles, [
    'Start on localhost', 'First commit', 'Push to GitHub', 'Branch and pull request',
    'Merge', 'Protect main', 'Tag v1.0.0', 'Release v1.1.0 with a typo', 'Revert',
    'Release v1.1.1', 'Settings file and .gitignore', 'AI change on a branch',
  ]);
});

test('REQ-TRK-002: every tile has one of three valid states; 1..3 in progress', () => {
  const { tiles } = loadData();
  tiles.forEach((t) => assert.ok(STATES.includes(t.state), `tile ${t.id}: ${t.state}`));
  const n = tiles.filter((t) => t.state === 'in-progress').length;
  assert.ok(n >= 1 && n <= 3);
});

test('REQ-TRK-002: stateLabel gives text label for each state (accessibility)', () => {
  assert.strictEqual(tracker.stateLabel('not-started'), 'Not started');
  assert.strictEqual(tracker.stateLabel('in-progress'), 'In progress');
  assert.strictEqual(tracker.stateLabel('done'), 'Done');
  assert.throws(() => tracker.stateLabel('bogus'));
});

test('REQ-TRK-003: key text is exact', () => {
  assert.strictEqual(tracker.KEY_TEXT, 'Grey: not started. Blue: in progress. Green: done.');
  assert.ok(read('tracker.html').includes('id="key"'));
});

test('REQ-TRK-004: counter derived from tiles', () => {
  const mk = (s) => s.map((state, i) => ({ id: i + 1, title: 't', state }));
  assert.strictEqual(tracker.counterText(mk(['done', 'done', 'in-progress', 'not-started'])), '2 of 4 done');
  assert.strictEqual(tracker.counterText(mk(Array(12).fill('not-started'))), '0 of 12 done');
});

test('REQ-TRK-005: page reads data file, no hard-coded bakery text/state in HTML', () => {
  for (const f of ['index.html', 'tracker.html']) {
    const html = read(f);
    assert.ok(html.includes('data.js'), f);
    assert.ok(!/Fresh bread/.test(html), f);
    assert.ok(!/Open daly/.test(html), f);
  }
});

test('REQ-TRK-006: hoursLine empty when absent, shown when present', () => {
  assert.strictEqual(tracker.hoursLine({ hours: null }), '');
  assert.strictEqual(tracker.hoursLine({}), '');
  assert.strictEqual(tracker.hoursLine({ hours: 'Open daly from 7am' }), 'Open daly from 7am');
  assert.strictEqual(tracker.versionLabel({ version: null }), 'No release yet');
  assert.strictEqual(tracker.versionLabel({ version: 'v1.0.0' }), 'v1.0.0');
});

test('PRD s4: data = current build state (steps 1-5 done, step 6 in progress)', () => {
  const d = loadData();
  assert.strictEqual(d.headline, 'Fresh bread baked every morning');
  assert.strictEqual(d.hours, null);
  assert.strictEqual(d.version, null);
  assert.ok(d.tiles.slice(0, 5).every((t) => t.state === 'done'));
  assert.strictEqual(d.tiles[5].state, 'in-progress');
  assert.ok(d.tiles.slice(6).every((t) => t.state === 'not-started'));
});

test('REQ-TRK-007: works offline, no external network references, no framework', () => {
  const all = ['index.html', 'tracker.html', 'styles.css', 'data.js', 'tracker.js'].map(read).join('\n');
  assert.ok(!/https?:\/\//.test(all), 'external URL found');
  assert.ok(!/fetch\(|XMLHttpRequest/.test(all), 'fetch breaks file:// use');
});

test('Design: palette tokens from PRD s7', () => {
  const css = read('styles.css').toLowerCase();
  for (const c of ['#1a1b1e', '#41a5ee', '#9ca3af']) assert.ok(css.includes(c), c);
  assert.ok(/montserrat/i.test(css) && /inter/i.test(css));
});

test('Accessibility: text contrast >= 4.5:1 for tile text on tile backgrounds', () => {
  const lum = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const css = read('styles.css');
  const get = (name) => (css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`)) || [])[1];
  for (const s of ['not-started', 'in-progress', 'done']) {
    const bg = get(`tile-${s}-bg`), fg = get(`tile-${s}-fg`);
    assert.ok(bg && fg, `tokens for ${s}`);
    assert.ok(ratio(bg, fg) >= 4.5, `${s} contrast ${ratio(bg, fg).toFixed(2)}`);
  }
});

test('Safety: .gitignore blocks real settings/env; example is blank and tracked', () => {
  const gi = read('.gitignore');
  for (const line of ['.env', '.env.*', '!.env.example', 'settings.json', '!settings.example.json', 'node_modules/', '.DS_Store']) {
    assert.ok(gi.split('\n').includes(line), `.gitignore lacks ${line}`);
  }
  const ex = JSON.parse(read('settings.example.json'));
  Object.values(ex).forEach((v) => assert.strictEqual(v, ''));
  assert.ok(!fs.existsSync(path.join(root, 'settings.json')));
  assert.ok(!fs.existsSync(path.join(root, '.env')));
});

test('Pages: home is the bakery hero, tracker has the 12 stages on its own page', () => {
  const home = read('index.html'), trk = read('tracker.html');
  for (const id of ['headline', 'hours', 'version', 'bakery-name']) assert.ok(home.includes(`id="${id}"`), `home ${id}`);
  for (const id of ['tiles', 'key', 'counter']) {
    assert.ok(trk.includes(`id="${id}"`), `tracker ${id}`);
    assert.ok(!home.includes(`id="${id}"`), `home must not have ${id}`);
  }
  assert.ok(!trk.includes('id="headline"'));
  assert.ok(home.includes('href="tracker.html"'), 'home links to tracker');
  assert.ok(trk.includes('href="index.html"'), 'tracker links home');
});

test('render() tolerates a page that only has some elements', () => {
  const nodes = { headline: { textContent: '' } };
  const doc = { getElementById: (id) => nodes[id] || null, createElement: () => { throw new Error('no tiles page'); } };
  tracker.render({ bakeryName: 'B', headline: 'H', hours: null, version: null, tiles: [] }, doc);
  assert.strictEqual(nodes.headline.textContent, 'H');
});
