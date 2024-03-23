// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from "./model.js";

export const AuthMiddleware = async (req, res, next) => {
  try {
    console.log(req.header('Authorization').replace('Bearer ', ''))
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error('Invalid Credentials');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.'});
  }
};

