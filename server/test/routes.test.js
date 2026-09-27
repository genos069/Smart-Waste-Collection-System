import { test, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Truck from '../src/models/Truck.js';
import { env } from '../src/config/env.js';
let server, base;
const id='507f1f77bcf86cd799439011';
before(async()=>{env.jwtSecret='test-secret-with-32-characters-long'; server=app.listen(0,'127.0.0.1'); await once(server,'listening'); base=`http://127.0.0.1:${server.address().port}/api`;});
after(()=>{server.close();mock.restoreAll();});
const token=(version=0)=>jwt.sign({id,version},env.jwtSecret);
const call=(path,method='GET',body,cookie)=>fetch(base+path,{method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:`token=${cookie}`}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
const user=(type='admin',version=0)=>mock.method(User,'findById',()=>({select:async()=>({_id:id,firstName:'Test',type,sessionVersion:version})}));
test('all operational endpoints require authentication',async()=>{
 for(const [method,path] of [['GET','/me'],['GET','/allBins'],['GET','/allAdmins'],['GET','/adminsById/123'],['DELETE','/deleteBin/123'],['DELETE','/deleteAllBins'],['DELETE','/deleteAdmin/123'],['PUT','/updateAdmin/123'],['POST','/createAdmins'],['GET','/tasks'],['POST','/location'],['POST','/pickups'],['POST','/collect-bin'],['POST','/update-status'],['POST','/seed/bins'],['POST','/seed/locations']]) assert.equal((await call(path,method)).status,401,path);
});
test('health, unknown route, malformed JSON and cross-site protection',async()=>{
 assert.equal((await call('/health')).status,200);assert.equal((await call('/missing')).status,404);
 const bad=await fetch(base+'/login',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});assert.equal(bad.status,400);assert.equal((await bad.json()).message,'Invalid JSON request body');
 assert.equal((await fetch(base+'/logout',{method:'POST',headers:{Origin:'https://untrusted.example'}})).status,403);
});
test('roles and reset session revocation are enforced',async()=>{
 const stub=user('driver',1);
 assert.equal((await call('/me','GET',undefined,token(0))).status,401);
 assert.equal((await call('/allAdmins','GET',undefined,token(1))).status,403);
 assert.equal((await call('/pickups','POST',{},token(1))).status,403);
 assert.equal((await call('/me','GET',undefined,token(1))).status,200);stub.mock.restore();
});
test('invalid IDs, coordinates, passwords and admin self-removal are rejected',async()=>{
 const stub=user();
 assert.equal((await call('/deleteBin/bad','DELETE',undefined,token())).status,400);
 assert.equal((await call('/pickups','POST',{name:'Bin',lat:'19junk',lng:3},token())).status,400);
 assert.equal((await call('/createAdmins','POST',{firstName:'A',email:'a@example.com',type:'admin',password:'short'},token())).status,400);
 assert.equal((await call(`/deleteAdmin/${id}`,'DELETE',undefined,token())).status,409);
 assert.equal((await call(`/updateAdmin/${id}`,'PUT',{type:'driver'},token())).status,409);stub.mock.restore();
});
test('driver GPS updates accept zero and cannot overwrite another driver',async()=>{
 const stub=user('driver');const truck=mock.method(Truck,'findOneAndUpdate',async(filter,update)=>{assert.deepEqual(filter,{driver:id});assert.deepEqual(update.$set.currentLocation,{lat:0,lng:0});return {currentLocation:update.$set.currentLocation};});
 assert.equal((await call('/location','POST',{lat:0,lng:0,driver:'someone-else'},token())).status,200);truck.mock.restore();stub.mock.restore();
});
test('database errors do not become 401s or leak stack details',async()=>{
 const stub=mock.method(User,'findById',()=>({select:async()=>{throw new Error('secret database details');}}));
 const response=await call('/me','GET',undefined,token());assert.equal(response.status,500);assert.doesNotMatch(JSON.stringify(await response.json()),/secret|stack/);stub.mock.restore();
});
