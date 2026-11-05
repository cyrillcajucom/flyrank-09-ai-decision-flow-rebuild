import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ReactFlow,Background,Controls,addEdge,useNodesState,useEdgesState} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './style.css';
import {Button} from './components/ui/button.jsx';
const defaults=[{id:'start',position:{x:80,y:80},data:{label:'Is this a support request?',prompt:'Is this a support request?'}},{id:'support',position:{x:400,y:20},data:{label:'Is it urgent?',prompt:'Is it urgent?'}},{id:'sales',position:{x:400,y:200},data:{label:'Is this sales?',prompt:'Is this sales?'}}];
function saved(){try{return JSON.parse(localStorage.getItem('decision-flow'))}catch{return null}}
function App(){
 const initial=saved();
 const[nodes,setNodes,onNodesChange]=useNodesState(initial?.nodes||defaults);
 const[edges,setEdges,onEdgesChange]=useEdgesState(initial?.edges||[{id:'yes',source:'start',target:'support',label:'YES'},{id:'no',source:'start',target:'sales',label:'NO'}]);
 const[selected,setSelected]=useState('start'),[branch,setBranch]=useState('YES');
 const [input,setInput]=useState('SUPPORT'),[run,setRun]=useState(null),[error,setError]=useState('');
 async function execute(){try{const r=await fetch('/api/runs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nodes,edges,input})});const d=await r.json();if(!r.ok)throw Error(d.error);setRun({id:d.id,status:'queued',log:[]})}catch(e){setError(e.message)}}
 useEffect(()=>{if(!run?.id||['done','failed'].includes(run.status))return;const timer=setInterval(async()=>{const r=await fetch('/api/runs/'+run.id);if(r.ok)setRun({...await r.json(),id:run.id})},1000);return()=>clearInterval(timer)},[run?.id,run?.status]);
 const node=nodes.find(n=>n.id===selected);
 useEffect(()=>{localStorage.setItem('decision-flow',JSON.stringify({nodes,edges}))},[nodes,edges]);
 function add(){const id=crypto.randomUUID();setNodes(ns=>[...ns,{id,position:{x:200,y:300},data:{label:'New decision?',prompt:'New decision?'}}]);setSelected(id)}
 return <main style={{padding:24}}><h1>AI Decision Flow — editor</h1><Button onClick={add}>Add node</Button><label>Input<input value={input} onChange={e=>setInput(e.target.value)}/></label><Button onClick={execute}>Run flow</Button><pre>{error||JSON.stringify(run,null,2)}</pre><label>Connection <select value={branch} onChange={e=>setBranch(e.target.value)}><option>YES</option><option>NO</option></select></label><label>Node prompt <textarea aria-label="Node prompt" value={node?.data.prompt||''} onChange={e=>setNodes(ns=>ns.map(n=>n.id===selected?{...n,data:{label:e.target.value,prompt:e.target.value}}:n))}/></label><div style={{height:600,border:'1px solid #ccc'}}><ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={(_,n)=>setSelected(n.id)} onConnect={connection=>setEdges(es=>addEdge({...connection,label:branch},es))} fitView><Background/><Controls/></ReactFlow></div><p>{nodes.length} decisions, {edges.length} connections. Changes are stored locally.</p></main>
}
createRoot(document.getElementById('root')).render(<App/>);
