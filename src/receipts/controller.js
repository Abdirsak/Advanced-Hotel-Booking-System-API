import { validationResult } from "express-validator";
import Receipt from "./model.js";
import { isValidObjectId } from "mongoose";
import Invoice from "../invoices/model.js";
import Sales from "../sales/model.js";
import { getAll } from "../utils/query.js";
import mongoose from "mongoose";

//
export const getReceipts = async (req, res) => {
  try {
    const { options = {}, query = {}, search = {} } = req.query;

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
    const page = options.page ? parseInt(options.page, 10) : 1;
    const limit = options.limit ? parseInt(options.limit, 10) : 10;

    const data = await Receipt.aggregate([
      { $match: combinedQuery }, // Apply the combined query as a match stage
      
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customerData"
        }
      },
      {
        $lookup: {
          from: "invoices",
          localField: "invoiceId",
          foreignField: "_id",
          as: "invoiceData"
        }
      },
      {
        $lookup: {
          from: "sales",
          localField: "invoiceData.sales",
          foreignField: "_id",
          as: "salesData"
        }
      },
     
      {
        $unwind: "$customerData"
      },
      {
        $unwind: "$invoiceData"
      },
      {
        $unwind: "$salesData"
      },
     
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    const totalDocs = await Receipt.countDocuments(combinedQuery);

    return res.status(200).json({
      data: {
        docs: data,
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
      },
      status: true
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

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
        .json({ status: false, message: "invalid Receipt id" });

    const deletedReceipt = await Receipt.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deletedReceipt)
      return res
        .status(400)
        .json({ status: false, message: "invalid Action, nothing to deleted" });

        const invoice = await mongoose.model("Invoice").findById(deletedReceipt?.invoiceId);
        const Sale = await mongoose.model("Sales").findById(invoice?.sales);

        if (!invoice) {
          const err = new Error("Invoice not found");
          return next(err);
        }
        invoice.paidAmount -= deletedReceipt.amount;
        Sale.balance += deletedReceipt.amount;
        // receipt.balance = Sale.balance;
      
       
        // console.log("paid amount: ",Sale.balance)
        // Update the status of the invoice based on the balance
        if (Sale.balance <= 0) {
          invoice.status = 'paid';
          Sale.status = 'completed';
        } else {
          invoice.status = 'unpaid';
          Sale.status = 'pending';
        }
      
        await invoice.save();
        await Sale.save();
    res.status(201).send({
      status: true,
      data: deletedReceipt,
      message: "Receipt deleted successfully...",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
