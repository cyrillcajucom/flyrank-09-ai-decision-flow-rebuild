import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateGraph, nextNode } from './graph.js';

test('YES and NO choose their own destinations', () => {
  const nodes = ['a','b','c'].map(id => ({id,data:{prompt:'Question?'}}));
  const edges = [{source:'a',target:'b',label:'YES'},{source:'a',target:'c',label:'NO'}];
  validateGraph(nodes,edges);
  assert.equal(nextNode(edges,'a','YES'),'b');
  assert.equal(nextNode(edges,'a','NO'),'c');
});
test('duplicate outcomes are rejected', () => {
  assert.throws(() => validateGraph([{id:'a',data:{prompt:'Q'}},{id:'b',data:{prompt:'Q'}}],[{source:'a',target:'b',label:'YES'},{source:'a',target:'b',label:'YES'}]));
});
