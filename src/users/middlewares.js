import jwt from "jsonwebtoken";
import User from "./model.js"; // Adjust the import path to your actual User model
import Customer from "../customer/model.js";
import Employee from "../employees/model.js";

export const AuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Please Authenticate" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Please Authenticate" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).send({ error: "Invalid Credentials" });
    }

    req.user = user;
    const employee = await Employee.findOne({ user: user._id });
    if (employee && employee?.branch) {
      req.user.branch = employee?.branch;
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
