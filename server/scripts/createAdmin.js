import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/User.js";
import { connectDatabase } from "../src/config/database.js";
import { email, text, password } from "../src/utils/validation.js";
const prompt = createInterface({ input: stdin, output: stdout });
try {
  const firstName = text(await prompt.question("First name: "), "First name");
  const address = email(await prompt.question("Email: "));
  // Supply through the local environment, never command arguments or repository files.
  const value = password(process.env.BOOTSTRAP_ADMIN_PASSWORD);
  await connectDatabase(); await User.init();
  if (await User.exists({ type: "admin" })) throw new Error("An admin already exists. Use the authenticated user-management page.");
  await User.create({ firstName, email: address, type: "admin", password: await bcrypt.hash(value, 12) });
  console.log("Administrator created.");
} catch (err) { console.error(err.message); process.exitCode = 1; }
finally { prompt.close(); await mongoose.disconnect(); }
