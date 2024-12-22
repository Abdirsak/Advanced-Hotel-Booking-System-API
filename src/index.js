import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// routes
import userRouter from "./users/route.js";
import employeeRouter from "./employees/route.js";
import customerRouter from "./customer/route.js";
import settingsRouter from "./settings/route.js";
import menusRouter from "./menus/route.js";
import rolesRoutes from "./roles/route.js";
import fs from "fs";
import path from "path";
import { AuthMiddleware } from "./users/middlewares.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const CONNECTION_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/test";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(morgan("tiny"))
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
app.use("/api/users", userRouter);
app.use("/api/employees", AuthMiddleware, employeeRouter);
app.use("/api/customers", AuthMiddleware, customerRouter);
app.use("/api/settings", AuthMiddleware, settingsRouter);
app.use("/api/menus", AuthMiddleware, menusRouter);
app.use("/api/roles", AuthMiddleware, rolesRoutes);

// import { fileURLToPath } from "url";

// // Convert `import.meta.url` to `__dirname`
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Use `path.resolve` to ensure the path is correctly resolved
// const filePath = path.resolve(
//   __dirname,
//   "D:/inventory management system/inv-ms-api/src/logo/logo.png"
// );

// fs.readFile(filePath, (err, data) => {
//   if (err) {
//     console.error("Error reading file:", err);
//     return;
//   }
//   const base64String = `data:image/png;base64,${data.toString("base64")}`;
//   // console.log(base64String);
// });
// console.log(base64String);
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
