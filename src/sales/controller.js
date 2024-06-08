import { validationResult } from "express-validator";
import Sales from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";

// Fetching All sales
export const getSales = getAll(Sales);

//creating sales document
export const createSales = async (req, res) => {
  try {
    const { error } = validationResult(req);
    if (error?.length) throw new Error(error[0]?.msg);

    const sales = await Sales.create(req.body);

    res.status(201).send({
      status: true,
      message: "sales created is successfully...",
      data: sales,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// update selected sales
export const updateSales = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid sales Id" });

    const updateSale = await Sales.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!updateSale)
      return res
        .status(400)
        .json({ status: false, message: "invalid action, nothing updated" });
    res.status(201).send({
      status: true,
      message: "Sale updated successfully..",
      data: updateSale,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// removing selected Sales
export const deleteSales = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid sales id" });

    const deleteSale = await Sales.findOneAndDelete({ _id: id }, { new: true });
    if (!deleteSale)
      return res
        .status(400)
        .json({ status: false, message: "invalid Action, nothing to deleted" });

    res.status(201).send({
      status: true,
      message: "Sale deleted successfully...",
      data: deleteSale,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
