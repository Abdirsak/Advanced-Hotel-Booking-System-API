import { validationResult } from "express-validator";
import Product from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll, getSingle } from "../utils/query.js";

export const getProducts = async (req, res) => {
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
    paginationOptions.populate = [
      { path: 'supplier' },
      { path: 'category' },
      { path: 'createdBy' },
    ];

    // Execute the paginate function with the combined query and options
    const data = await Product.paginate(combinedQuery, paginationOptions);

    return res.status(200).json({ data, status: true });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getSingleProduct = getSingle(Product);

export const createProduct = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);

    const product = await Product.create(req.body);

    res.status(201).send({
      status: true,
      message: "product created successfully",
      data: product,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid product id" });

    const updateProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    if (!updateProduct)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to update" });

    res.status(201).send({
      status: true,
      message: "Product updated successfully",
      data: updateProduct,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid Product id" });

    const deleteProduct = await Product.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deleteProduct)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to delete" });

    res.send({
      status: true,
      message: "Product deleted successfully",
      data: deleteProduct,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
