import { validationResult } from "express-validator";
import Payment from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";

// Fetching All Payments
export const getPayments = getAll(Payment);

//creating Payment document
export const createPayment = async (req, res) => {
  try {
    const { error } = validationResult(req);
    if (error?.length) throw new Error(error[0]?.msg);

    const newPayment = await Payment.create(req.body);

    res.status(201).send({
      status: true,
      message: "Payment created is successfully...",
      data: newPayment,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// update selected Payment
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid Payment Id" });

    const updatedPayment = await Payment.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!updatedPayment)
      return res
        .status(400)
        .json({ status: false, message: "invalid action, nothing updated" });
    res.status(201).send({
      status: true,
      message: "Payment updated successfully..",
      data: updatedPayment,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// removing selected Payment
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid Payment id" });

    const deletedPayment = await Payment.findOneAndDelete({ _id: id }, { new: true });
    if (!deletedPayment)
      return res
        .status(400)
        .json({ status: false, message: "invalid Action, nothing to deleted" });

    res.status(201).send({
      status: true,
      message: "Payment deleted successfully...",
      data: deletedPayment,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
