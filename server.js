import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connect.js";
// middleware
import errorHandlerMiddleWare from "./middleware/error-handler.js";
import notFoundMiddleWare from "./middleware/not-found.js";

app.get("/", (req, res) => {
  throw new Error("error");
  res.send("Welcome!");
});

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    app.listen(port, () => {
      console.log(`Server is running at ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
