import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// routes
import branchRouter from "./branches/route.js";
import userRouter from "./users/route.js";
import employeeRouter from "./employees/route.js";
import customerRouter from "./customer/route.js";
import supplierRouter  from './suppliers/router';

dotenv.config();

const PORT = process.env.PORT || 8000;
const CONNECTION_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/test";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);
app.use("/uploads", express.static("public/uploads"));

app.get("/", (req, res) => {
  res.send("welcome");
});

// * REGISTER ROTES
app.use("/api/branches", branchRouter);
app.use("/api/users", userRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/customer", customerRouter)
app.use("/api/supplier", supplierRouter)

app.use("/*", (req, res) => {
  res.status(404).json({ status: false, message: "Incorrect URL Destination" });
});

// *MONGO SETUP
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connection success");
  })
  .catch((e) => {
    console.error("Error is: " + e.message);
    process.exit(1);
  });

mongoose.connection.once("end", () => {
  console.log("Mongodb connect");
});

mongoose.connection.on("error", (error) => {
  throw error;
});

app.listen(PORT, (err) => {
  if (err) throw err;

  console.log(`Server running on ${PORT}`);
});
