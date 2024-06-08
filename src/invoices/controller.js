import { validationResult } from "express-validator";
import Invoice from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";

// Fetching All Invoices
export const getInvoices = getAll(Invoice);

//creating Invoice document
export const createInvoice = async (req, res) => {
  try {
    const { error } = validationResult(req);
    if (error?.length) throw new Error(error[0]?.msg);

    const invoice = await Invoice.create(req.body);

    res.status(201).send({
      status: true,
      message: "invoice created is successfully...",
      data: invoice,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// update selected Invoice
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid invoice Id" });

    const updateInv = await Invoice.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!updateInv)
      return res
        .status(400)
        .json({ status: false, message: "invalid action, nothing updated" });
    res.status(201).send({
      status: true,
      message: "Invoice updated successfully..",
      data: updateInv,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// removing selected Invoice
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "invalid invoice id" });

    const deleteInv = await Invoice.findOneAndDelete({ _id: id }, { new: true });
    if (!deleteInv)
      return res
        .status(400)
        .json({ status: false, message: "invalid Action, nothing to deleted" });

    res.status(201).send({
      status: true,
      message: "invoice deleted successfully...",
      data: deleteInv,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
