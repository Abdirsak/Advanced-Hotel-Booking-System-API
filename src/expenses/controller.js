import { validationResult } from "express-validator";
import Expense from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll,getSingle } from "../utils/query.js";

export const getAllExpenses = getAll(Expense);
export const getSingleExpense = getSingle(Expense);

export const createExpense = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);

    const expense = await Expense.create(req.body);

    res.status(201).send({
      status: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid Expense id" });

    const updateExpense = await Expense.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    if (!updateExpense)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to update" });

    res.status(201).send({
      status: true,
      message: "Expense updated successfully",
      data: updateExpense,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid Expense id" });

    const deleteExpense = await Expense.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deleteExpense)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to delete" });

    res.send({
      status: true,
      message: "Expense deleted successfully",
      data: deleteExpense,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
