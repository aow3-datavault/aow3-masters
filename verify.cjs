const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function session(saved) {
  const elements = new Map();
  let stored = saved ? JSON.stringify(saved) : null;
  const element = id => {
    if (!elements.has(id)) elements.set(id, { innerHTML: '', textContent: '', checked: true, open: false, value: '', addEventListener() {}, setAttribute() {}, focus() {}, close() { this.open = false; }, showModal() { this.open = true; } });
    return elements.get(id);
  };
  const context = vm.createContext({
    console: { info() {} }, URL, Date,
    document: { getElementById: element, querySelectorAll: () => [], querySelector: () => element('query'), addEventListener() {}, body: { classList: { remove() {}, contains: () => false } }, contains: () => true },
    window: { scrollTo() {}, matchMedia: () => ({ matches: false }) },
    localStorage: { getItem: () => stored, setItem: (key, value) => { stored = value; } }
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'summer-data.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + '\nglobalThis.api = { snapshot: () => JSON.parse(JSON.stringify(state)), featured: getFeaturedSlot, confirm: confirmInvitation, replace: confirmReserve, persist: persistState, stored: () => localStorage.getItem(STORAGE_KEY) };', context);
  return { api: context.api, element };
}

test('confirmation is idempotent and survives reload', () => {
  const first = session();
  first.api.confirm();
  first.api.confirm();
  const data = first.api.snapshot();
  assert.equal(data.slots.length, 32);
  assert.equal(data.slots.filter(slot => slot.status === 'confirmed').length, 27);
  const restored = session(JSON.parse(first.api.stored()));
  assert.equal(restored.api.featured().status, 'confirmed');
});

test('replaced player cannot confirm a reserve invitation', () => {
  const seed = session();
  const saved = JSON.parse(JSON.stringify({ slots: seed.api.snapshot().slots.map(slot => ({ status: slot.status, activeName: slot.activePlayer.name, history: [] })), authenticated: true }));
  saved.slots[0] = { status: 'invited', activeName: 'Reserve Pilot 01', history: [{ playerName: 'Hero Dominator', status: 'declined' }] };
  const restored = session(saved);
  assert.equal(restored.api.featured().activePlayer.name, 'Hero Dominator');
  restored.api.confirm();
  assert.equal(restored.api.snapshot().slots[0].status, 'invited');
});

test('restore preserves replacement history and ignores malformed entries', () => {
  const seed = session();
  const saved = { slots: seed.api.snapshot().slots.map(slot => ({ status: slot.status, activeName: slot.activePlayer.name, history: [] })), authenticated: true };
  saved.slots[24].activeName = 'Reserve Pilot 01';
  saved.slots[24].history = Array.from({ length: 10 }, () => ({ playerName: 'condantoico', status: 'declined' }));
  saved.slots[24].history.push(null);
  const restored = session(saved);
  assert.equal(restored.api.snapshot().slots[24].activePlayer.name, 'Reserve Pilot 01');
  assert.equal(restored.api.snapshot().slots[24].history.length, 10);
});

test('reserve occupies one slot, preserves previous participant and cannot be assigned twice', () => {
  const { api, element } = session();
  element('reserve-player-select').value = 'reserve-01';
  element('reserve-confirm').checked = true;
  api.replace(25);
  api.replace(27);
  const data = api.snapshot();
  assert.equal(data.slots.length, 32);
  assert.equal(data.slots[24].activePlayer.name, 'Reserve Pilot 01');
  assert.equal(data.slots[24].history[0].player.name, 'condantoico');
  assert.equal(data.slots[26].activePlayer.name, 'DEVIL_MAY_CRY');
});
