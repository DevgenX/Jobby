import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

//db and authenticate user
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

// middleware
import errorHandlerMiddleWare from "./middleware/error-handler.js";
import notFoundMiddleWare from "./middleware/not-found.js";

// make json available to us on controllers
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);

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
