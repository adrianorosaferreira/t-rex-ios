const test = require('node:test');
const assert = require('node:assert');
const { addScore, parse, MAX } = require('../www/ranking.js');

test('adds a score in descending order and returns its rank', () => {
  const list = [{ score: 300, date: 'a' }, { score: 100, date: 'b' }];
  const r = addScore(list, 200.7, 'c');
  assert.deepStrictEqual(r.list.map((e) => e.score), [300, 200, 100]);
  assert.strictEqual(r.rank, 2);
});

test('keeps only the top 10', () => {
  let list = [];
  for (let i = 1; i <= 12; i++) list = addScore(list, i * 10, 'd' + i).list;
  assert.strictEqual(list.length, MAX);
  assert.strictEqual(list[0].score, 120);
  assert.strictEqual(list[MAX - 1].score, 30);
});

test('a score below the top 10 gets rank 0', () => {
  let list = [];
  for (let i = 0; i < 10; i++) list = addScore(list, 100, 'x').list;
  assert.strictEqual(addScore(list, 5, 'y').rank, 0);
});

test('parse tolerates bad data', () => {
  assert.deepStrictEqual(parse('not json'), []);
  assert.deepStrictEqual(parse(null), []);
  assert.deepStrictEqual(parse('[{"score":5},{"x":1}]'), [{ score: 5 }]);
});
