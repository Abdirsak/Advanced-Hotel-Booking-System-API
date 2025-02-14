import { validationResult } from "express-validator";
import Employee from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";
import User from "../users/model.js";

export const getEmployees = getAll(Employee);

export const getSingleEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid employee id" });

    const employee = await Employee.findById(id);
    res.send({ status: true, data: employee });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);

    const check = await Employee.findOne({ contact: req.params.contact})

    const checkuser = await User.findOne({ username: req.body.username })

    if(check){
      return res.status(400).json({ status: false, message: "Contact already exists" });
    }

    if(checkuser){
      return res.status(400).json({ status: false, message: "Username already exists" });
    }
    

    const employee = await Employee.create(req.body);

    res.status(201).send({
      status: true,
      message: "employee created successfully",
      data: employee,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid employee id" });

    const updateEmployee = await Employee.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    if (!updateEmployee)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to update" });

    res.status(201).send({
      status: true,
      message: "employee updated successfully",
      data: updateEmployee,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid employee id" });

    const deletedUser = await Employee.findOne({ _id: id });

    if (deletedUser) {
      await User.findOneAndDelete({ username: deletedUser?.username });
    }

    const deletedEmployee = await Employee.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deletedEmployee)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to delete" });

    res.send({
      status: true,
      message: "employee deleted successfully",
      data: deletedEmployee,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
