import { validationResult } from "express-validator";
import User from "./model.js";
import mongoose, { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { getAll } from "../utils/query.js";
import Employee from "../employees/model.js";

// Get users : GET /users
// export const getUsers = getAll(User);

export const getUsers = async (req, res) => {
  try {
    const { options, query = {}, search = {} } = req.query;

    // Construct search criteria if search keyword and fields are provided
    const { keyword, fields = [] } = search;
    let searchCriteria = {};

    if (keyword && fields.length) {
      const searchFields = Array.isArray(fields) ? fields : [fields];
      searchCriteria = {
        $or: searchFields.map((field) => ({
          [field]: { $regex: keyword, $options: "i" },
        })),
      };
    }

    // Merge the search criteria with the provided query
    const combinedQuery = { ...query, ...searchCriteria };

    if (req?.user?.branch) {
      combinedQuery.branch = req?.user?.branch;
    }

    // Set up the options for pagination, including the populate option if provided
    let paginationOptions = { ...options };

    // Adding population options
    paginationOptions.populate = [{ path: "createdBy", model: "User" }];

    // Execute the paginate function with the combined query and options
    const data = await User.paginate(combinedQuery, paginationOptions);

    return res.status(200).json({ data, status: true });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

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
    console.log("user : ", req.user);
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);
    const { username } = req.body;
    let isUserExits = await User.findOne({ username });

    if (isUserExits) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ ...req.body, createdBy: req.user._id });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

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

    const emp = await Employee.findOne({user:new mongoose.Types.ObjectId(user._id)})

    
    let branch = emp.branch
    // console.log(branch)
    console.log("username is :", username);

    if (!user || !(await user.isCorrectPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const data = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      status: user.status,
      role: user.role,
      lastLogin: user.lastLogin,
      departmentId:user.departmentId,
      branch
    }
    
    res.json({
      status: true,
      message: "User Logged in successfully",
      data,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Update User : PATCH /users/:id
// export const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isValidObjectId(id))
//       return res
//         .status(400)
//         .json({ status: false, message: "Invalid User id" });
//     const updates = Object.keys(req.body);
//     updates.forEach((update) => (req.user[update] = req.body[update]));
//     await req.user.save();
//     if (!updates)
//       return res
//         .status(400)
//         .json({ status: false, message: "Invalid action, Nothing to update" });

//     res.status(201).send({
//       status: true,
//       message: "User updated successfully",
//       data: updates,
//     });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// };

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid User id" });
    const update = await User.findByIdAndUpdate({ _id: id }, { ...req.body });

    res.status(201).send({
      status: true,
      message: "User updated successfully",
      data: update,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Delete User : DELETE /users/:id
// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isValidObjectId(id))
//       return res
//         .status(400)
//         .json({ status: false, message: "Invalid User id" });

//     const deletedUser = await User.findOneAndDelete({ _id: id }, { new: true });
//     if (!deletedUser)
//       return res
//         .status(400)
//         .json({ status: false, message: "Invalid action, Nothing to delete" });

//     res.send({
//       status: true,
//       message: "User deleted successfully",
//       data: deletedUser,
//     });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// };

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
