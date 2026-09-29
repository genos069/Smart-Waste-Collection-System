import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import User from '../src/models/User.js';
import { forgotPassword, resetPassword } from '../src/controllers/authController.js';
import { env } from '../src/config/env.js';
const response=()=>({body:null,json(value){this.body=value;return this;},clearCookie(){return this;}});
test('reset tokens are hashed, consumed once and revoke old sessions',async(t)=>{
 const old={exposeResetToken:env.exposeResetToken,nodeEnv:env.nodeEnv};env.exposeResetToken=true;env.nodeEnv='development';t.after(()=>{mock.restoreAll();Object.assign(env,old);});
 const user={_id:'507f1f77bcf86cd799439011',email:'user@example.com',sessionVersion:0};
 mock.method(User,'findOneAndUpdate',async(filter,update)=>{
  if(filter.email){Object.assign(user,update.$set);return user;}
  if(filter.resetPasswordToken!==user.resetPasswordToken || user.resetPasswordExpire<=filter.resetPasswordExpire.$gt)return null;
  Object.assign(user,update.$set);delete user.resetPasswordToken;delete user.resetPasswordExpire;user.sessionVersion+=update.$inc.sessionVersion;return user;
 });
 const sent=response();await forgotPassword({body:{email:'USER@example.com'}},sent);
 const token=sent.body.resetToken;assert.equal(token.length,64);assert.notEqual(user.resetPasswordToken,token);assert.equal(user.resetPasswordToken,crypto.createHash('sha256').update(token).digest('hex'));
 const reset=response();await resetPassword({body:{token,newPassword:'ValidPassword123!'}},reset);
 assert.equal(await bcrypt.compare('ValidPassword123!',user.password),true);assert.equal(user.sessionVersion,1);assert.equal(user.resetPasswordToken,undefined);
 await assert.rejects(resetPassword({body:{token,newPassword:'AnotherPassword123!'}},response()),{status:400});
});
test('production cannot return reset tokens without configured email',async(t)=>{
 const old={nodeEnv:env.nodeEnv,exposeResetToken:env.exposeResetToken,smtpHost:env.smtpHost,mailFrom:env.mailFrom};t.after(()=>Object.assign(env,old));Object.assign(env,{nodeEnv:'production',exposeResetToken:true,smtpHost:'',mailFrom:''});
 await assert.rejects(forgotPassword({body:{email:'user@example.com'}},response()),{status:503});
});
