import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Sales from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";
import Customer from './../customer/model.js';
import Product from './../products/model.js';
import Invoice from "../invoices/model.js";
// Fetching All sales
export const getSales = getAll(Sales);

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

    const { customer, saleDate, salesItems, status, discount } = req.body;

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

    let totalAmount = 0;

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

      const itemTotal = quantity * product?.price;
      item.total = itemTotal;
      totalAmount += itemTotal;

      // Reduce the stock
      product.quantity -= quantity;
      await product.save({ session });
    }

    // Apply discount if provided
    const finalAmount = totalAmount - discount 
    if (finalAmount < 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ status: false, message: 'Discount cannot exceed total amount' });
    }

    const sale = new Sales({
      customer,
      saleDate,
      totalAmount: finalAmount,
      discount: discount || 0,
      salesItems,
      status,
    });

    await sale.save({ session });

    // Generate invoice
    const invoice = new Invoice({
      sales: sale._id,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      totalAmount: finalAmount,
      status: 'unpaid',
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