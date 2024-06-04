import { validationResult } from "express-validator";
import ExpenseCategory from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll,getSingle } from "../utils/query.js";

export const getAllExpenseCategories = getAll(ExpenseCategory);
export const getSingleExpenseCategory = getSingle(ExpenseCategory);

export const createExpenseCategory = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);

    const expense = await ExpenseCategory.create(req.body);

    res.status(201).send({
      status: true,
      message: "ExpenseCategory created successfully",
      data: expense,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const updateExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid ExpenseCategory id" });

    const updatedExpenseCategory = await ExpenseCategory.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedExpenseCategory)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to update" });

    res.status(201).send({
      status: true,
      message: "Expense Category updated successfully",
      data: updatedExpenseCategory,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid ExpenseCategory id" });

    const deletedExpenseCategory = await ExpenseCategory.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deletedExpenseCategory)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to delete" });

    res.send({
      status: true,
      message: "Expense Category deleted successfully",
      data: deletedExpenseCategory,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
