import { validationResult } from "express-validator";
import Branch from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";

export const getBranches = getAll(Branch);

export const createBranch = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);

    const branch = await Branch.create(req.body);

    res.status(201).send({
      status: true,
      message: "branch created successfully",
      data: branch,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid branch id" });

    const updatedBranch = await Branch.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!updatedBranch)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to update" });

    res.status(201).send({
      status: true,
      message: "Branch updated successfully",
      data: updatedBranch,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid branch id" });

    const deletedBranch = await Branch.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deletedBranch)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to delete" });

    res.send({
      status: true,
      message: "branch deleted successfully",
      data: deletedBranch,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
