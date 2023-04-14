// allows you to render errors without using try/catch
import "express-async-errors";
import morgan from "morgan";
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//db and authenticate user
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

// middleware
import errorHandlerMiddleWare from "./middleware/error-handler.js";
import notFoundMiddleWare from "./middleware/not-found.js";
import authenticateUser from "./middleware/auth.js";

// make json available to us on controllers\

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// build to production

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, ".client/build/", "index.html"));
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
