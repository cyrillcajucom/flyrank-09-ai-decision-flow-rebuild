import {nextNode, validateGraph} from './graph.js';
export async function executeGraph({nodes, edges, input}, step, decide, state) {
 validateGraph(nodes,edges);state.status='running';let current=nodes[0].id;const visited=new Set();
 while(current){
  if(visited.has(current))throw new Error('Cycle detected; execution stopped');
  visited.add(current);const node=nodes.find(n=>n.id===current);state.active=current;
  const answer=await step.run(`decision-${current}`,async()=>{
   const value=(await decide(node.data.prompt,input)).trim();
   if(!['YES','NO'].includes(value))throw new Error('The model did not return exactly YES or NO');
   return value;
  });
  if(!state.log.some(entry=>entry.node===current))state.log.push({node:current,prompt:node.data.prompt,answer});
  current=nextNode(edges,current,answer);
 }
 state.status='done';state.active=null;delete state.error;return state.log;
}
