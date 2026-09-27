import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import Bin from '../src/models/Bin.js';
import { simulateBinFill } from '../src/jobs/binFillSimulator.js';
test('simulator excludes undelivered cargo and uses compare-and-set writes',async(t)=>{
 t.after(()=>mock.restoreAll());const updatedAt=new Date();
 mock.method(Bin,'find',filter=>{assert.deepEqual(filter.$or,[{status:{$ne:'collected'}},{dumpedAt:{$type:'date'}},{collectedBy:{$exists:false}}]);return{lean:async()=>[{_id:'bin',fillLevel:74,status:'idle',updatedAt}]};});
 mock.method(Bin,'updateOne',async(filter,update)=>{assert.deepEqual(filter,{_id:'bin',fillLevel:74,status:'idle',updatedAt});assert.equal(update.$set.fillLevel,75);assert.equal(update.$set.status,'active');});
 await simulateBinFill(()=>0.1);
});
