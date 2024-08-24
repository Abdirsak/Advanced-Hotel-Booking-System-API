import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Purchase from "./model.js";
import Product from "../products/model.js";
import { isValidObjectId } from "mongoose";

// get purchases        GET: /purchases/
// export const getPurchases = async (req, res) => {
//   try {
//     const purchases = await Purchase.find({});
//     res.send({ status: true, data: purchases });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// };
export const getPurchases = async (req, res) => {
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

    if (req?.user?.branch) {
      combinedQuery.branch = req?.user?.branch;
    }

    // Set up the options for pagination, including the populate option if provided
    const page = options.page ? parseInt(options.page, 10) : 1;
    const limit = options.limit ? parseInt(options.limit, 10) : 10;

    const data = await Purchase.aggregate([
      { $match: combinedQuery }, // Apply the combined query as a match stage
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplierId",
          foreignField: "_id",
          as: "supplierData",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productsData",
        },
      },
      {
        $unwind: "$productsData",
      },
      {
        $unwind: "$supplierData",
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
      { $limit: limit },
    ]);

    const totalDocs = await Purchase.countDocuments(combinedQuery);

    return res.status(200).json({
      data: {
        docs: data,
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
      },
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
// Function to handle a new purchase
export const createPurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);
    const {
      supplierId,
      purchaseDate,
      expectedDate,
      orderStatus,
      paymentStatus,
      billingAddress,
      shippingAddress,
      items,
      taxInformation,
      invoiceId,
      reference,
      branch,
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      throw new Error("Items are required for a purchase");
    }

    let totalAmount = 0;

    // Process each item in the purchase
    for (const item of items) {
      const { productId, quantity, cost } = item;

      // Validate quantity
      if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero for each item");
      }

      // Validate product ID
      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${productId}`);
      }

      // Update product quantity
      // product.quantity += quantity;
      // await product.save({ session });
      // await Product.findByIdAndUpdate(productId,{$set:{quantity: }})
      await Product.findByIdAndUpdate(
        productId,
        { $inc: { quantity: quantity } },
        { session }
      );

      // Calculate total for the item
      const itemTotal = quantity * cost;
      totalAmount += itemTotal;

      // Add total to the item
      item.total = itemTotal;
    }

    // Create a new purchase
    const purchase = new Purchase({
      supplierId,
      purchaseDate,
      expectedDate,
      orderStatus,
      paymentStatus,
      billingAddress,
      shippingAddress,
      items,
      totalAmount,
      taxInformation,
      invoiceId,
      reference,
      branch,
    });

    // Save the purchase document
    await purchase.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json({
        status: true,
        message: "Purchase created successfully",
        purchase,
      });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ status: false, message: err.message });
  }
};

// update purchase      PATCH: /purchases/:id
// export const updatePurchase = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isValidObjectId(id))
//       return res
//         .status(400)
//         .json({ status: false, message: "Invalid branch id" });

//     const updatedPurchase = await Purchase.findOneAndUpdate(
//       { _id: id },
//       req.body,
//       {
//         new: true,
//       }
//     );
//     if (!updatedPurchase)
//       return res
//         .status(400)
//         .json({ status: false, message: "Invalid action, Nothing to update" });

//     res.status(201).send({
//       status: true,
//       message: "Purchase updated successfully",
//       data: updatedPurchase,
//     });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// };

// delete purchase        DELETE: /purchases/:id
// export const deletePurchase = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isValidObjectId(id))
//       return res
//         .status(400)
//         .json({ status: false, message: "Invalid branch id" });

//     const deletedPurchase = await Purchase.findOneAndDelete(
//       { _id: id },
//       { new: true }
//     );
//     if (!deletedPurchase)
//       return res
//         .status(400)
//         .json({ status: false, message: "Invalid action, Nothing to delete" });

//     res.send({
//       status: true,
//       message: "Purchase deleted successfully",
//       data: deletedPurchase,
//     });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// };

export const updatePurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid purchase id" });
    const {
      items,
      orderStatus,
      paymentStatus,
      billingAddress,
      shippingAddress,
    } = req.body;

    // Fetch the existing purchase
    const purchase = await Purchase.findById(id).session(session);
    if (!purchase) {
      throw new Error("Purchase not found");
    }

    // Revert inventory changes from existing items
    for (const item of purchase.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      product.quantity -= item.quantity;
      await product.save({ session });
    }

    // Update purchase details
    purchase.orderStatus = orderStatus || purchase.orderStatus;
    purchase.paymentStatus = paymentStatus || purchase.paymentStatus;
    purchase.billingAddress = billingAddress || purchase.billingAddress;
    purchase.shippingAddress = shippingAddress || purchase.shippingAddress;
    purchase.items = [];
    purchase.totalAmount = 0;

    let totalAmount = 0;

    // Process new items
    for (const newItem of items) {
      const { productId, quantity, cost } = newItem;

      // Validate quantity
      if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero for each item");
      }

      // Validate product ID
      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${productId}`);
      }

      // Update product quantity
      product.quantity += quantity;
      await product.save({ session });

      // Calculate total for the item
      const itemTotal = quantity * cost;
      totalAmount += itemTotal;

      // Add item to purchase
      purchase.items.push({ productId, quantity, cost, total: itemTotal });
    }

    purchase.totalAmount = totalAmount;

    await purchase.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({
        status: true,
        message: "Purchase updated successfully",
        purchase,
      });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ status: false, message: err.message });
  }
};

export const deletePurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);
    const { id } = req.params;

    // Fetch the existing purchase
    const purchase = await Purchase.findById(id).session(session);
    if (!purchase) {
      throw new Error("Purchase not found");
    }

    // Revert inventory changes from existing items
    for (const item of purchase.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      product.quantity -= item.quantity;
      await product.save({ session });
    }

    // Remove the purchase
    await Purchase.deleteOne({ _id: purchase._id }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ status: true, message: "Purchase deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ status: false, message: err.message });
  }
};
