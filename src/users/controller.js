import { validationResult } from "express-validator";
import User from "./model.js";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { getAll } from "../utils/query.js";

// Get users : GET /users
export const getUsers = getAll(User);

// Get single users : GET /users/id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid User id" });
    const userInfo = await User.findById(id);
    if (!userInfo)
      return res.status(404).json({ status: false, message: "User not found" });
    res.send({ status: true, data: userInfo });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Create User : POST /users
export const createUser = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);
    const { username } = req.body;
    let isUserExits = await User.findOne({ username });

    if (isUserExits) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    // res.status(201).json({ token });

    res.status(201).send({
      status: true,
      message: "User created successfully",
      data: user,
      token: token,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// Login User : POST /users/login
export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    console.log("username is :", username);

    if (!user || !(await user.isCorrectPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.json({
      status: true,
      message: "User Logged in successfully",
      data: user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User : PATCH /users/:id
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid User id" });
    const updates = Object.keys(req.body);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    if (!updates)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to update" });

    res.status(201).send({
      status: true,
      message: "User updated successfully",
      data: updates,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Delete User : DELETE /users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid User id" });

    const deletedUser = await User.findOneAndDelete({ _id: id }, { new: true });
    if (!deletedUser)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to delete" });

    res.send({
      status: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
