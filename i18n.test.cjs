const { test } = require('node:test');
const assert = require('node:assert/strict');
const { translate, resolveLanguage } = require('./i18n.js');

test('translates English labels and dynamic counters without changing names or chat text', () => {
  assert.equal(translate('Ожидает ответа', 'en'), 'Awaiting response');
  assert.equal(translate('32 слота', 'en'), '32 slots');
  assert.equal(translate('BO1 · 16 МАТЧЕЙ', 'en'), 'BO1 · 16 MATCHES');
  assert.equal(translate('Вылет в 1/4 ·', 'en'), 'Eliminated in the quarterfinals ·');
  assert.equal(translate('condantoico · Отклонено', 'en'), 'condantoico · Declined');
  assert.equal(translate('Hero Dominator', 'en'), 'Hero Dominator');
  assert.equal(translate('встречаемся у центра', 'en'), 'встречаемся у центра');
});

test('translates English labels back to Russian when switching locales', () => {
  assert.equal(translate('Awaiting response', 'ru'), 'Ожидает ответа');
  assert.equal(translate('32 slots', 'ru'), '32 слота');
  assert.equal(translate('condantoico · Declined', 'ru'), 'condantoico · Отклонено');
});

test('explicit URL locale takes priority over the separately stored locale', () => {
  assert.equal(resolveLanguage('?lang=en', 'ru'), 'en');
  assert.equal(resolveLanguage('?lang=ru', 'en'), 'ru');
  assert.equal(resolveLanguage('', 'en'), 'en');
  assert.equal(resolveLanguage('?lang=fr', 'en'), 'en');
  assert.equal(resolveLanguage('', ''), 'ru');
});
