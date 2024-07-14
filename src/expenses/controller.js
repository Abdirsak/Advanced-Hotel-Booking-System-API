import { validationResult } from "express-validator";
import Expense from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll, getSingle } from "../utils/query.js";
import Payment from "../payments/model.js";

// export const getAllExpenses = getAll(Expense);
export const getSingleExpense = getSingle(Expense);

export const getAllExpenses = async (req, res) => {
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

    // Set up the options for pagination, including the populate option if provided
    let paginationOptions = { ...options };

    // Adding population options
    paginationOptions.populate = [{ path: "category" }, { path: "createdBy" }];

    // Execute the paginate function with the combined query and options
    const data = await Expense.paginate(combinedQuery, paginationOptions);

    return res.status(200).json({ data, status: true });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);

    console.log("curr user: ", req.user);

    const expense = await Expense.create({ ...req.body, createdBy: req?.user });

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

export const payExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { method } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid expense id" });
    }

    const expense = await Expense.findById(id);
    if (!expense) {
      return res
        .status(400)
        .json({ status: false, message: "Expense not found" });
    }

    const payment = await Payment.create({
      expenseId: expense._id,
      paymentDate: new Date(),
      amount: expense.amount,
      method,
    });

    if (payment) {
      const updateExpense = await Expense.findByIdAndUpdate(
        expense._id,
        { status: "paid" },
        { new: true }
      );

      if (!updateExpense) {
        return res
          .status(500)
          .json({ status: false, message: "Failed to update expense status" });
      }

      return res.status(201).json({
        status: true,
        message: "Expense paid successfully",
        data: updateExpense,
      });
    } else {
      return res
        .status(500)
        .json({ status: false, message: "Payment creation failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while processing the request",
      error: error.message,
    });
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
