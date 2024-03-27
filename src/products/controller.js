import { validationResult } from "express-validator";
import Product from './model.js'
import { isValidObjectId } from "mongoose";

export const getProducts = async (req, res) => {
  try {
    const product = await Product.find({});
    res.send({ status: true, data: product });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

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
