import { readFile } from "fs/promises";

import dotenv from "dotenv";

dotenv.config();

import connectDB from "./db/connect.js";
import Job from "./models/Job.js";

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    // deletes the existing data
    await Job.deleteMany();

    // This code is useful for loading JSON data from a file into a JavaScript application for further processing or manipulation.
    const jsonProducts = JSON.parse(
      await readFile(new URL("./mockdata.json", import.meta.url))
    );
    await Job.create(jsonProducts);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
