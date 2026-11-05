import 'dotenv/config';
import express from 'express';
import {Inngest} from 'inngest';
import {serve} from 'inngest/express';
const app=express();const inngest=new Inngest({id:'decision-flow-rebuild'});
const hello=inngest.createFunction({id:'hello',triggers:{event:'flow/hello'}},async({step})=>step.run('hello',()=>({ready:true})));
app.use('/api/inngest',serve({client:inngest,functions:[hello]}));
app.get('/api/health',(_,res)=>res.json({status:'ok'}));
app.listen(8109,()=>console.log('Decision API on 8109'));
