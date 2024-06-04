import { validationResult } from "express-validator";
import ProductCategory from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll,getSingle } from "../utils/query.js";

export const getAllProductCategories = getAll(ProductCategory);
export const getSingleProductCategory = getSingle(ProductCategory);

export const createProductCategory = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);

    const expense = await ProductCategory.create(req.body);

    res.status(201).send({
      status: true,
      message: "Product Category created successfully",
      data: expense,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid ProductCategory id" });

    const updatedProductCategory = await ProductCategory.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedProductCategory)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to update" });

    res.status(201).send({
      status: true,
      message: "Product Category updated successfully",
      data: updatedProductCategory,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid ProductCategory id" });

    const deletedProductCategory = await ProductCategory.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deletedProductCategory)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to delete" });

    res.send({
      status: true,
      message: "Product Category deleted successfully",
      data: deletedProductCategory,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
