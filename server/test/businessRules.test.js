import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coordinates, email, password } from '../src/utils/validation.js';
import { taskState, destination, orderPickups } from '../src/utils/collectionState.js';
import { requireProximity } from '../src/services/collectionService.js';
import User from '../src/models/User.js';
import Bin from '../src/models/Bin.js';
const locations=[{_id:'1',type:'bmc',name:'BMC',lat:19,lng:84},{_id:'2',type:'dumpyard',name:'Dump',lat:20,lng:85}];
const bin=(id,fillLevel,extra={})=>({_id:id,name:id,fillLevel,status:'active',coordinates:{coordinates:[84,19]},...extra});
test('strict coordinates, email and plaintext-password validation',()=>{
 assert.deepEqual(coordinates('0',0),{lat:0,lng:0});
 for(const invalid of ['', ' ',null,true,'19abc',Infinity,91])assert.throws(()=>coordinates(invalid,0),{status:400});
 assert.throws(()=>coordinates(0,-181),{status:400});assert.equal(email(' User@Example.com '),'user@example.com');
 assert.throws(()=>password('short'),{status:400});assert.throws(()=>password('😀'.repeat(20)),{status:400});
});
test('reset fields persist, secrets are hidden and existing collection is retained',()=>{
 const user=new User({firstName:'A',email:'A@EXAMPLE.COM',password:'hash',resetPasswordToken:'hash',resetPasswordExpire:new Date()});
 assert.equal(user.toObject().resetPasswordToken,'hash');assert.equal(user.email,'a@example.com');assert.equal(User.collection.name,'admins');
 for(const field of ['password','resetPasswordToken','resetPasswordExpire','sessionVersion'])assert.equal(User.schema.path(field).options.select,false);
});
test('model rejects invalid GeoJSON and fill levels',async()=>{
 const valid={name:'Test',coordinates:{type:'Point',coordinates:[0,0]}};
 await assert.doesNotReject(new Bin(valid).validate());await assert.rejects(new Bin({...valid,fillLevel:101}).validate());await assert.rejects(new Bin({...valid,coordinates:{type:'Point',coordinates:[200,100]}}).validate());
});
test('stored location coordinates and stable frontend IDs',()=>{
 assert.equal(destination(locations[0]).id,'home');assert.equal(destination(locations[1]).id,'warehouse');assert.equal(destination(locations[1]).lat,20);assert.equal(destination(undefined),null);
});
test('empty inventory never directs an empty truck to dump; missing setup is explicit',()=>{
 const tasks=taskState([],null,locations,'driver');assert.equal(tasks.nextTarget,null);assert.equal(tasks.warehouse.status,'locked');assert.equal(taskState([bin('a',90)],null,[],'driver').setupRequired,true);
});
test('75 percent threshold and fixed trip snapshot exclude new fills',()=>{
 const tasks=taskState([bin('a',75),bin('b',74),bin('new',95)],{status:'collecting',pickupIds:['a','b']},locations,'driver');assert.deepEqual(tasks.routeOrder.map(p=>p.id),['a']);
});
test('picked bins remain visible and only the carrying driver can unload',()=>{
 const bins=[bin('a',0,{status:'collected',collectedBy:'driver'}),bin('green',10)];const tasks=taskState(bins,{status:'collecting',pickupIds:['a']},locations,'driver');
 assert.equal(tasks.pickups[0].status,'picked');assert.equal(tasks.nextTarget.id,'warehouse');assert.equal(taskState(bins,null,locations,'other').cargoCount,0);
});
test('completed unloading remains completed and returns truck to BMC',()=>{
 const tasks=taskState([bin('a',0,{status:'collected',collectedBy:'driver',dumpedAt:new Date()})],{status:'returning',pickupIds:['a']},locations,'driver');assert.equal(tasks.warehouse.status,'completed');assert.equal(tasks.nextTarget.id,'home');assert.equal(tasks.deliveryComplete,true);
});
test('nearest eligible bins first; stale/far GPS rejected',()=>{
 assert.deepEqual(orderPickups([{id:'far',lat:1,lng:1},{id:'near',lat:0,lng:.001}],{lat:0,lng:0}).map(p=>p.id),['near','far']);
 const truck={currentLocation:{lat:0,lng:0},lastUpdated:new Date()};assert.doesNotThrow(()=>requireProximity(truck,{lat:0,lng:0}));assert.throws(()=>requireProximity(truck,{lat:1,lng:1}),{status:409});assert.throws(()=>requireProximity({...truck,lastUpdated:new Date(0)},{lat:0,lng:0}),{status:409});
});
