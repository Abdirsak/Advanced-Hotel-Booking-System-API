import { validationResult } from "express-validator";
import InventoryAdjustment from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll,getSingle } from "../utils/query.js";

export const getAllInventoryAdjustment = getAll(InventoryAdjustment);
export const getSingleInventoryAdjustment = getSingle(InventoryAdjustment);

export const createInventoryAdjustment = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);

    const product = await InventoryAdjustment.create(req.body);

    res.status(201).send({
      status: true,
      message: "New Inventory Adjustment created successfully",
      data: product,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const updateInventoryAdjustment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid product id" });

    const updatedInventoryAdjustment = await InventoryAdjustment.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedInventoryAdjustment)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to update" });

    res.status(201).send({
      status: true,
      message: "Inventory Adjustment updated successfully",
      data: updatedInventoryAdjustment
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteInventoryAdjustment= async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid Inventory Adjustment id" });

    const deletedInventoryAdjustment = await InventoryAdjustment.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deletedInventoryAdjustment)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to delete" });

    res.send({
      status: true,
      message: "Inventory Adjustment deleted successfully",
      data: deletedInventoryAdjustment,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
