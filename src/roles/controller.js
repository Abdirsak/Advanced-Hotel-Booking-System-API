import { validationResult } from "express-validator";
import Role from "./modal.js";
import { isValidObjectId } from "mongoose";
import { getAll, getSingle } from "../utils/query.js";

// Get all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({
      status: true,
      message: "Roles retrieved successfully",
      data: roles,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

//Get Single Role
export const getRole = getSingle(Role);

// Create a new role
export const createRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error(errors.array()[0].msg);

    const { name } = req.body;

    // Check if the role name already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        status: false,
        message: `${name} already exists`,
      });
    }

    const role = await Role.create(req.body);

    res.status(201).send({
      status: true,
      message: "Role created successfully...",
      data: role,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// Update an existing role
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid role ID" });

    const updatedRole = await Role.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!updatedRole)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, nothing updated" });

    res.status(201).send({
      status: true,
      message: "Role updated successfully...",
      data: updatedRole,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
