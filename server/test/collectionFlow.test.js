import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import Bin from '../src/models/Bin.js';
import Truck from '../src/models/Truck.js';
import Location from '../src/models/Location.js';
import { completeCollectionAction } from '../src/services/collectionService.js';
const driver='507f1f77bcf86cd799439011', a='507f1f77bcf86cd799439021', b='507f1f77bcf86cd799439022';
const query=(value)=>({session:async()=>value});
function fixture() {
 const session={test:true};
 const bins=[a,b].map((_id)=>({_id,name:_id,fillLevel:90,status:'active',coordinates:{coordinates:[0,0]},save:async(options)=>{assert.equal(options.session,session);}}));
 const truck={driver,status:'idle',pickupIds:[],currentLocation:{lat:0,lng:0},lastUpdated:new Date(),save:async(options)=>{assert.equal(options.session,session);}};
 const locations=[{_id:'home',type:'bmc',name:'BMC',lat:0,lng:0},{_id:'dump',type:'dumpyard',name:'Dump',lat:0,lng:0}];
 mock.method(mongoose.connection,'transaction',async(fn)=>fn(session));
 mock.method(Truck,'findOne',filter=>{assert.equal(filter.driver,driver);return query(truck);});
 mock.method(Location,'find',()=>query(locations));
 mock.method(Location,'updateMany',async()=>({modifiedCount:2}));
 mock.method(Bin,'findById',id=>query(bins.find(bin=>bin._id===id)));
 mock.method(Bin,'find',()=>query(bins.filter(bin=>bin.status!=='collected'&&bin.fillLevel>=75)));
 mock.method(Bin,'exists',filter=>query(bins.some(bin=>filter._id.$in.includes(bin._id)&&bin.status!=='collected'&&bin.fillLevel>=75)));
 mock.method(Bin,'updateMany',async(filter,update)=>{let modifiedCount=0;for(const bin of bins){if(bin.collectedBy===filter.collectedBy&&bin.status==='collected'&&!bin.dumpedAt){bin.dumpedAt=update.$set.dumpedAt;modifiedCount++;}}return{modifiedCount};});
 return {bins,truck};
}
test('pickup → remaining pickups → unload → BMC, including retries and invalid transitions',async(t)=>{
 t.after(()=>mock.restoreAll());const {bins,truck}=fixture();
 await assert.rejects(completeCollectionAction(driver,'warehouse'),{status:409});
 await assert.rejects(completeCollectionAction(driver,'home'),{status:409});
 const picked=await completeCollectionAction(driver,'pickup',a);
 assert.equal(picked.pickup.status,'picked');assert.equal(truck.status,'collecting');assert.deepEqual(truck.pickupIds,[a,b]);assert.equal(bins[0].fillLevel,0);
 assert.equal((await completeCollectionAction(driver,'pickup',a)).pickup.status,'picked');
 await assert.rejects(completeCollectionAction(driver,'warehouse'),{status:409});
 await completeCollectionAction(driver,'pickup',b);
 const drop=await completeCollectionAction(driver,'warehouse');assert.equal(drop.deliveryComplete,true);assert.equal(truck.status,'returning');assert.ok(bins.every(bin=>bin.dumpedAt));
 assert.equal((await completeCollectionAction(driver,'warehouse')).warehouse.status,'completed');
 await assert.rejects(completeCollectionAction(driver,'pickup',a),{status:409});
 assert.equal((await completeCollectionAction(driver,'home')).home.status,'completed');assert.equal(truck.status,'idle');assert.deepEqual(truck.pickupIds,[]);
});
test('ineligible or already claimed bins cannot be collected',async(t)=>{
 t.after(()=>mock.restoreAll());const {bins}=fixture();bins[0].fillLevel=74;
 await assert.rejects(completeCollectionAction(driver,'pickup',a),{status:409});
 bins[0].fillLevel=90;bins[0].status='collected';bins[0].collectedBy='another-driver';
 await assert.rejects(completeCollectionAction(driver,'pickup',a),{status:409});
});
