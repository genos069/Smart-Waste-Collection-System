import mongoose from "mongoose";
import { env } from "./env.js";
export async function connectDatabase() {
  await mongoose.connect(env.dbUrl, { serverSelectionTimeoutMS: 10000 });
  const topology = await mongoose.connection.db.admin().command({ hello: 1 });
  if (!topology.setName && topology.msg !== "isdbgrid") {
    await mongoose.disconnect();
    throw new Error("Collection transactions require a MongoDB replica set or Atlas; standalone MongoDB is not supported");
  }
}
