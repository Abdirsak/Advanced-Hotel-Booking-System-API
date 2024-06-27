import jwt from "jsonwebtoken";
import User from "./model.js";

export const AuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("Cookies:", token);

  if (!token) {
    return res.status(401).json({ error: "Please Authenticate" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: decoded.id });

  if (!user) {
    return res.status(401).send({ error: "Invalid Credentials" });
  }

  req.user = user;
  next();
};
