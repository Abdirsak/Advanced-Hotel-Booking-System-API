import { validationResult } from "express-validator";
import Supplier from "./model";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";

//
export const getSupplier = getAll(Supplier);

export const createSupplier = async (req, res) => {
  try {
    const { error } = validationResult(req);
    if (error.length) throw new Error(error[0]?.msg);

    const supplier = await Supplier.create(req.body);

    res.status(201).send({
      status: true,
      message: "supplier created is successfully...",
      data: supplier,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid supplier Id" });

    const updateSuppl = await Supplier.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!updateSuppl)
      return res
        .status(400)
        .json({ status: false, message: "invalid action, nothing updated" });
    res.status(201).send({
      status: true,
      message: "Suppl updated successfully..",
      data: updateSuppl,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid supplier id" });

    const deleteSuppl = await Customer.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deleteSuppl)
      return res
        .status(400)
        .json({ status: false, message: "invalid Action, nothing to deleted" });

    res.status(201).send({
      status: true,
      data: deleteSuppl,
      message: "supplier deleted successfully...",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
