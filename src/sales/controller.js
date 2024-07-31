import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Sales from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll,getSingle } from "../utils/query.js";
import Customer from './../customer/model.js';
import Product from './../products/model.js';
import Invoice from "../invoices/model.js";
// Fetching All sales
export const getSalesById = getSingle(Sales)
// all sales
export const getSales = async(req,res)=>{
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

    const data = await Sales.aggregate([
      { $match: combinedQuery }, // Apply the combined query as a match stage
      {
        $unwind: "$salesItems"
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customersData"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "salesItems.productId",
          foreignField: "_id",
          as: "productsData"
        }
      },
      {
        $unwind: "$productsData"
      },
      {
        $unwind: "$customersData"
      },
      // {
      //   $group: {
      //     _id: "$_id",
      //     supplierId: { $first: "$supplierId" },
      //     purchaseDate: { $first: "$purchaseDate" },
      //     reference: { $first: "$reference" },
      //     expectedDate: { $first: "$expectedDate" },
      //     orderStatus: { $first: "$orderStatus" },
      //     paymentStatus: { $first: "$paymentStatus" },
      //     billingAddress: { $first: "$billingAddress" },
      //     shippingAddress: { $first: "$shippingAddress" },
      //     totalAmount: { $first: "$totalAmount" },
      //     taxInformation: { $first: "$taxInformation" },
      //     invoiceId: { $first: "$invoiceId" },
      //     items: {
      //       $push: {
      //         productId: "$items.productId",
      //         quantity: "$items.quantity",
      //         cost: "$items.cost",
      //         total: "$items.total",
      //         productDetails: "$productsData"
      //       }
      //     },
      //     supplierDetails: { $first: "$supplierData" }
      //   }
      // },
      // {
      //   $project: {
      //     _id: 1,
      //     supplierId: 1,
      //     purchaseDate: 1,
      //     reference: 1,
      //     expectedDate: 1,
      //     orderStatus: 1,
      //     paymentStatus: 1,
      //     billingAddress: 1,
      //     shippingAddress: 1,
      //     totalAmount: 1,
      //     taxInformation: 1,
      //     invoiceId: 1,
      //     items: 1,
      //     supplierDetails: 1
      //   }
      // },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    const totalDocs = await Sales.countDocuments(combinedQuery);

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
// sales loss or profit report
export const getLosOrProfitSales = async(req,res)=>{
  try {
    // console.log(req.startDate," and ", req.params.endData)
    if(!req.params.startDate && !req.params.endDate){
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

    const data = await Sales.aggregate([
      {
        $match: combinedQuery,
      }, // Apply the combined query as a match stage
      {
        $unwind: "$salesItems"
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customersData"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "salesItems.productId",
          foreignField: "_id",
          as: "productsData"
        }
      },
      {
        $lookup: {
          from: "invoices",
          localField: "_id",
          foreignField: "sales",
          as: "invoiceData"
        }
      },
      {
        $unwind: "$productsData"
      },
      {
        $unwind: "$customersData"
      },
      {
        $unwind: "$invoiceData"
      },
      // {
      //   $group: {
      //     _id: "$_id",
      //     supplierId: { $first: "$supplierId" },
      //     purchaseDate: { $first: "$purchaseDate" },
      //     reference: { $first: "$reference" },
      //     expectedDate: { $first: "$expectedDate" },
      //     orderStatus: { $first: "$orderStatus" },
      //     paymentStatus: { $first: "$paymentStatus" },
      //     billingAddress: { $first: "$billingAddress" },
      //     shippingAddress: { $first: "$shippingAddress" },
      //     totalAmount: { $first: "$totalAmount" },
      //     taxInformation: { $first: "$taxInformation" },
      //     invoiceId: { $first: "$invoiceId" },
      //     items: {
      //       $push: {
      //         productId: "$items.productId",
      //         quantity: "$items.quantity",
      //         cost: "$items.cost",
      //         total: "$items.total",
      //         productDetails: "$productsData"
      //       }
      //     },
      //     supplierDetails: { $first: "$supplierData" }
      //   }
      // },
      // {
      //   $project: {
      //     _id: 1,
      //     supplierId: 1,
      //     purchaseDate: 1,
      //     reference: 1,
      //     expectedDate: 1,
      //     orderStatus: 1,
      //     paymentStatus: 1,
      //     billingAddress: 1,
      //     shippingAddress: 1,
      //     totalAmount: 1,
      //     taxInformation: 1,
      //     invoiceId: 1,
      //     items: 1,
      //     supplierDetails: 1
      //   }
      // },
      {$sort:{createdAt:-1}},
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    const totalDocs = await Sales.countDocuments(combinedQuery);

    return res.status(200).json({
      data: {
        docs: data,
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
      },
      status: true
    });
  }else{
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

    const data = await Sales.aggregate([
      {
        $match: {
          $and: [
            combinedQuery,
            
            {
              saleDate: {
                $gte: new Date(req.params.startDate),
                $lte: new Date(req.params.endDate),
              },
            },
          ],
        },
      },
      // Apply the combined query as a match stage
      {
        $unwind: "$salesItems"
      },
      
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customersData"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "salesItems.productId",
          foreignField: "_id",
          as: "productsData"
        }
      },
      {
        $lookup: {
          from: "invoices",
          localField: "_id",
          foreignField: "sales",
          as: "invoiceData"
        }
      },
      {
        $unwind: "$productsData"
      },
      {
        $unwind: "$customersData"
      },
      {
        $unwind: "$invoiceData"
      },
      // {
      //   $group: {
      //     _id: "$_id",
      //     supplierId: { $first: "$supplierId" },
      //     purchaseDate: { $first: "$purchaseDate" },
      //     reference: { $first: "$reference" },
      //     expectedDate: { $first: "$expectedDate" },
      //     orderStatus: { $first: "$orderStatus" },
      //     paymentStatus: { $first: "$paymentStatus" },
      //     billingAddress: { $first: "$billingAddress" },
      //     shippingAddress: { $first: "$shippingAddress" },
      //     totalAmount: { $first: "$totalAmount" },
      //     taxInformation: { $first: "$taxInformation" },
      //     invoiceId: { $first: "$invoiceId" },
      //     items: {
      //       $push: {
      //         productId: "$items.productId",
      //         quantity: "$items.quantity",
      //         cost: "$items.cost",
      //         total: "$items.total",
      //         productDetails: "$productsData"
      //       }
      //     },
      //     supplierDetails: { $first: "$supplierData" }
      //   }
      // },
      // {
      //   $project: {
      //     _id: 1,
      //     supplierId: 1,
      //     purchaseDate: 1,
      //     reference: 1,
      //     expectedDate: 1,
      //     orderStatus: 1,
      //     paymentStatus: 1,
      //     billingAddress: 1,
      //     shippingAddress: 1,
      //     totalAmount: 1,
      //     taxInformation: 1,
      //     invoiceId: 1,
      //     items: 1,
      //     supplierDetails: 1
      //   }
      // },
      {$sort:{createdAt:-1}},
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    const totalDocs = await Sales.countDocuments(combinedQuery);

    return res.status(200).json({
      data: {
        docs: data,
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
      },
      status: true
    });
  }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// sales ledger
export const getSalesLedger = async(req,res)=>{
  try {
    if(!req.params.startDate && !req.params.endDate){
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

    const data = await Sales.aggregate([
      {
        $match: combinedQuery,
      }, // Apply the combined query as a match stage
      {
        $unwind: "$salesItems"
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customersData"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "salesItems.productId",
          foreignField: "_id",
          as: "productsData"
        }
      },
      {
        $lookup: {
          from: "invoices",
          localField: "_id",
          foreignField: "sales",
          as: "invoiceData"
        }
      },
      {
        $unwind: "$productsData"
      },
      {
        $unwind: "$customersData"
      },
      {
        $unwind: "$invoiceData"
      },
      // {
      //   $group: {
      //     _id: "$_id",
      //     supplierId: { $first: "$supplierId" },
      //     purchaseDate: { $first: "$purchaseDate" },
      //     reference: { $first: "$reference" },
      //     expectedDate: { $first: "$expectedDate" },
      //     orderStatus: { $first: "$orderStatus" },
      //     paymentStatus: { $first: "$paymentStatus" },
      //     billingAddress: { $first: "$billingAddress" },
      //     shippingAddress: { $first: "$shippingAddress" },
      //     totalAmount: { $first: "$totalAmount" },
      //     taxInformation: { $first: "$taxInformation" },
      //     invoiceId: { $first: "$invoiceId" },
      //     items: {
      //       $push: {
      //         productId: "$items.productId",
      //         quantity: "$items.quantity",
      //         cost: "$items.cost",
      //         total: "$items.total",
      //         productDetails: "$productsData"
      //       }
      //     },
      //     supplierDetails: { $first: "$supplierData" }
      //   }
      // },
      // {
      //   $project: {
      //     _id: 1,
      //     supplierId: 1,
      //     purchaseDate: 1,
      //     reference: 1,
      //     expectedDate: 1,
      //     orderStatus: 1,
      //     paymentStatus: 1,
      //     billingAddress: 1,
      //     shippingAddress: 1,
      //     totalAmount: 1,
      //     taxInformation: 1,
      //     invoiceId: 1,
      //     items: 1,
      //     supplierDetails: 1
      //   }
      // },
      {$sort:{createdAt:-1}},
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    const totalDocs = await Sales.countDocuments(combinedQuery);

    return res.status(200).json({
      data: {
        docs: data,
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
      },
      status: true
    });
  }else{
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

    const data = await Sales.aggregate([
      {
        $match: {
          $and: [
            combinedQuery,
            
            {
              saleDate: {
                $gte: new Date(req.params.startDate),
                $lte: new Date(req.params.endDate),
              },
            },
          ],
        },
      },
      // Apply the combined query as a match stage
      {
        $unwind: "$salesItems"
      },
      
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customersData"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "salesItems.productId",
          foreignField: "_id",
          as: "productsData"
        }
      },
      {
        $lookup: {
          from: "invoices",
          localField: "_id",
          foreignField: "sales",
          as: "invoiceData"
        }
      },
      {
        $unwind: "$productsData"
      },
      {
        $unwind: "$customersData"
      },
      {
        $unwind: "$invoiceData"
      },
      // {
      //   $group: {
      //     _id: "$_id",
      //     supplierId: { $first: "$supplierId" },
      //     purchaseDate: { $first: "$purchaseDate" },
      //     reference: { $first: "$reference" },
      //     expectedDate: { $first: "$expectedDate" },
      //     orderStatus: { $first: "$orderStatus" },
      //     paymentStatus: { $first: "$paymentStatus" },
      //     billingAddress: { $first: "$billingAddress" },
      //     shippingAddress: { $first: "$shippingAddress" },
      //     totalAmount: { $first: "$totalAmount" },
      //     taxInformation: { $first: "$taxInformation" },
      //     invoiceId: { $first: "$invoiceId" },
      //     items: {
      //       $push: {
      //         productId: "$items.productId",
      //         quantity: "$items.quantity",
      //         cost: "$items.cost",
      //         total: "$items.total",
      //         productDetails: "$productsData"
      //       }
      //     },
      //     supplierDetails: { $first: "$supplierData" }
      //   }
      // },
      // {
      //   $project: {
      //     _id: 1,
      //     supplierId: 1,
      //     purchaseDate: 1,
      //     reference: 1,
      //     expectedDate: 1,
      //     orderStatus: 1,
      //     paymentStatus: 1,
      //     billingAddress: 1,
      //     shippingAddress: 1,
      //     totalAmount: 1,
      //     taxInformation: 1,
      //     invoiceId: 1,
      //     items: 1,
      //     supplierDetails: 1
      //   }
      // },
      {$sort:{createdAt:-1}},
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    const totalDocs = await Sales.countDocuments(combinedQuery);

    return res.status(200).json({
      data: {
        docs: data,
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
      },
      status: true
    });
  }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
//creating sales document
export const createSales = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { customer, saleDate, salesItems, status, discount,paidBalance,totalAmount,reference } = req.body;

    const customerInfo = await Customer.findById(customer).session(session);
    
    // Basic validations
    if (!customerInfo) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ status: false, message: 'Customer not found' });
    }
    if (!salesItems || salesItems.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ status: false, message: 'Sales items are required' });
    }

    // let totalAmount = 0;

    for (const item of salesItems) {
      const { productId, quantity } = item;   
      if (quantity <= 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ status: false, message: 'Quantity must be greater than zero for each item' });
      }

      const product = await Product.findById(productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ status: false, message: `Product not found for ID: ${productId}` });
      }

      if (product.quantity < quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ status: false, message: `Insufficient stock for product ID: ${productId}` });
      }

      // const itemTotal = quantity * product?.price;
      // item.total = itemTotal;
      // totalAmount += itemTotal;

      // Reduce the stock
      // product.quantity -= quantity;
      // await product.save({ session });
      await Product.findByIdAndUpdate(productId, { $inc: { quantity: quantity } }, { session });
    }

    // Apply discount if provided
    const finalAmount = totalAmount - discount 
    const balance = totalAmount - paidBalance - discount
    if (finalAmount < 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ status: false, message: 'Discount cannot exceed total amount' });
    }

    const sale = new Sales({
      customer,
      saleDate,
      totalAmount: paidBalance,
      discount: discount || 0,
      salesItems,
      status,
      balance
    });

    await sale.save({ session });

    const lastInvoice = await Invoice.findOne({}).sort({createdAt:-1});
    // const invoiceNo = lastInvoice.invoiceNo += 1 
    // Generate invoice
    const invoice = new Invoice({
      sales: sale._id,
      customer,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      totalAmount: finalAmount,
      paidAmount: paidBalance,
      reference:reference,
      invoiceNo:req.body.invoiceNo,
      status: balance == 0? "paid" :'unpaid',
    });

    await invoice.save({ session });

    // Associate the invoice with the sale
    sale.invoice = invoice._id;
    await sale.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ status: true, message: 'Sale and invoice created successfully', sale, invoice });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ status: false, message: err.message });
  }
};

// update selected sales
// export const updateSales = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isValidObjectId(id))
//       return res
//         .status(400)
//         .json({ status: false, message: "invalid sales Id" });

//     const updateSale = await Sales.findOneAndUpdate({ _id: id }, req.body, {
//       new: true,
//     });

//     if (!updateSale)
//       return res
//         .status(400)
//         .json({ status: false, message: "invalid action, nothing updated" });
//     res.status(201).send({
//       status: true,
//       message: "Sale updated successfully..",
//       data: updateSale,
//     });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// };

// // removing selected Sales
// export const deleteSales = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isValidObjectId(id))
//       return res
//         .status(400)
//         .json({ status: false, message: "invalid sales id" });

//     const deleteSale = await Sales.findOneAndDelete({ _id: id }, { new: true });
//     if (!deleteSale)
//       return res
//         .status(400)
//         .json({ status: false, message: "invalid Action, nothing to deleted" });

//     res.status(201).send({
//       status: true,
//       message: "Sale deleted successfully...",
//       data: deleteSale,
//     });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// };

export const deleteSales = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Fetch the existing sale
    const sale = await Sales.findById(id).session(session);
    if (!sale) {
      throw new Error('Sale not found');
    }

    // Revert inventory changes from existing items
    for (const item of sale.salesItems) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      product.quantity += item.quantity;
      await product.save({ session });
    }

    // Remove the invoice
    await Invoice.deleteOne({ sales: sale._id }).session(session);

    // Remove the sale
    await Sales.deleteOne({ _id: sale._id }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ status: true, message: 'Sale deleted successfully' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ status: false, message: err.message });
  }
};

export const updateSales = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {id} = req.params
    const {  customer, saleDate, salesItems, status, discount } = req.body;

    // Fetch the existing sale
    const sale = await Sales.findById(id).session(session);
    if (!sale) {
      throw new Error('Sale not found');
    }

    // Revert inventory changes from existing items
    for (const item of sale.salesItems) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      product.quantity += item.quantity;
      await product.save({ session });
    }

    // Clear existing items
    sale.salesItems = [];
    sale.totalAmount = 0;

    let totalAmount = 0;

    // Process new items
    for (const newItem of salesItems) {
      const { productId, quantity } = newItem;

      // Validate quantity
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than zero for each item');
      }

      // Validate product ID
      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${productId}`);
      }

      // Ensure sufficient stock
      if (product.quantity < quantity) {
        throw new Error(`Insufficient stock for product ID: ${productId}`);
      }

      // Calculate total for the item
      const itemTotal = quantity * product.price;
      newItem.total = itemTotal;
      totalAmount += itemTotal;

      // Reduce product quantity
      product.quantity -= quantity;
      await product.save({ session });

      // Add item to sale
      sale.salesItems.push({ productId, quantity, total: itemTotal });
    }

    // Apply discount if provided
    const finalAmount = totalAmount - discount;
    if (finalAmount < 0) {
      throw new Error('Discount cannot exceed total amount');
    }

    sale.customer = customer;
    sale.saleDate = saleDate;
    sale.totalAmount = finalAmount;
    sale.discount = discount || 0;
    sale.status = status;

    await sale.save({ session });

    // Update invoice 
    const invoice = await Invoice.findOne({ sales: sale._id }).session(session);
    invoice.totalAmount = finalAmount;
    invoice.status = 'unpaid'; // Reset status to unpaid
    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ status: true, message: 'Sale updated successfully', sale, invoice });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ status: false, message: err.message });
  }
};