import { validationResult } from "express-validator";
import Loan from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";

//
export const getAllLoans = getAll(Loan);

export const createLoan = async (req, res) => {
  try {
    const { error } = validationResult(req);
    if (error?.length) throw new Error(error[0]?.msg);

    const loan = await Loan.create(req.body);

    res.status(201).send({
      status: true,
      message: "loan created is successfully...",
      data: loan,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const updateLoan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid loan Id" });

    const updatedLoan = await Loan.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );

    if (!updatedLoan)
      return res
        .status(400)
        .json({ status: false, message: "invalid action, nothing updated" });
    res.status(201).send({
      status: true,
      message: "Loan updated successfully..",
      data: updatedLoan,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid loan id" });

    const deletedLoan = await Loan.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deletedLoan)
      return res
        .status(400)
        .json({ status: false, message: "invalid Action, nothing to deleted" });

    res.status(201).send({
      status: true,
      data: deletedLoan,
      message: "loan deleted successfully...",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
