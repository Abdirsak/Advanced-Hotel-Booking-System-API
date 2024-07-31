import { validationResult } from "express-validator";
import Invoice from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";
import mongoose from "mongoose"
// Fetching All Invoices
export const getInvoices = async (req, res) => {
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

    const data = await  Invoice.aggregate([
      { $match: combinedQuery }, // Apply the combined query as a match stage
      {
        $lookup: {
          from: "sales",
          localField: "sales",
          foreignField: "_id",
          as: "salesData"
        }
      },
      {
        $lookup: {
          from: "customers",
          localField: "salesData.customer",
          foreignField: "_id",
          as: "customerData"
        }
      },
      {$unwind: "$salesData"},
      {$unwind: "$customerData"},
   
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    const totalDocs = await Invoice.countDocuments(combinedQuery);

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
export const getInvoiceByCustomerId = async (req, res) => {
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

    // const data = await  Invoice.aggregate([
    //   { $match: combinedQuery }, // Apply the combined query as a match stage
    //   {
    //     $lookup: {
    //       from: "sales",
    //       localField: "sales",
    //       foreignField: "_id",
    //       as: "salesData"
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "customers",
    //       localField: "salesData.customer",
    //       foreignField: "_id",
    //       as: "customerData"
    //     }
    //   },
    //   {$unwind: "$salesData"},
    //   {$unwind: "$customerData"},
   
    //   { $skip: (page - 1) * limit },
    //   { $limit: limit }
    // ]);

    // console.log(req.params.customerId)
    const data = await Invoice.find({customer:new mongoose.Types.ObjectId(req.params.customerId)})
    const totalDocs = await Invoice.countDocuments(combinedQuery);

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
