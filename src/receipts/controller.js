import { validationResult } from "express-validator";
import Receipt from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";

//
export const getReceipts = getAll(Receipt);

export const createReceipt = async (req, res) => {
  try {
    const { error } = validationResult(req);
    if (error?.length) throw new Error(error[0]?.msg);

    const receipt = await Receipt.create(req.body);

    res.status(201).send({
      status: true,
      message: "new receipt created is successfully...",
      data: receipt,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const updateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid supplier Id" });

    const updatedReceipt = await Receipt.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!updatedReceipt)
      return res
        .status(400)
        .json({ status: false, message: "invalid action, nothing updated" });
    res.status(201).send({
      status: true,
      message: "Receipt updated successfully..",
      data: updatedReceipt,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid supplier id" });

    const deletedReceipt = await Receipt.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deletedReceipt)
      return res
        .status(400)
        .json({ status: false, message: "invalid Action, nothing to deleted" });

    res.status(201).send({
      status: true,
      data: deletedReceipt,
      message: "Receipt deleted successfully...",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
