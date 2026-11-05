import {test} from 'node:test';
import assert from 'node:assert/strict';
import {executeGraph} from './engine.js';
const nodes=['start','yes','no'].map(id=>({id,data:{prompt:id}}));
const edges=[{source:'start',target:'yes',label:'YES'},{source:'start',target:'no',label:'NO'}];
for(const answer of ['YES','NO'])test(`executes only the ${answer} branch in named durable steps`,async()=>{
 const steps=[],state={log:[]};
 await executeGraph({nodes,edges,input:'test'},{run:async(id,fn)=>{steps.push(id);return fn()}},async()=>answer,state);
 assert.deepEqual(steps,['decision-start',`decision-${answer.toLowerCase()}`]);assert.deepEqual(state.log.map(x=>x.node),['start',answer.toLowerCase()]);assert.equal(state.status,'done');
});
test('rejects explanatory LLM answers instead of guessing routes',async()=>{await assert.rejects(()=>executeGraph({nodes,edges,input:''},{run:(_,fn)=>fn()},async()=> 'YES because true',{log:[]}),/exactly YES or NO/)});
test('stops cycles and preserves executed prefix',async()=>{
 const state={log:[]};await assert.rejects(()=>executeGraph({nodes:[nodes[0]],edges:[{source:'start',target:'start',label:'YES'}],input:''},{run:(_,fn)=>fn()},async()=> 'YES',state),/Cycle/);assert.equal(state.log.length,1);
});
