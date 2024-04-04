import { validationResult } from "express-validator";
import Purchase from "./model.js";
import { isValidObjectId } from "mongoose";

// get purchases        GET: /purchases/
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({});
    res.send({ status: true, data: purchases });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// create new purchase     POST: /purchases/
export const createPurchase = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);

    const purchase = await Purchase.create(req.body);

    res.status(201).send({
      status: true,
      message: "purchase created successfully",
      data: purchase,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// update purchase      PATCH: /purchases/:id
export const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid branch id" });

    const updatedPurchase = await Purchase.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!updatedPurchase)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to update" });

    res.status(201).send({
      status: true,
      message: "Purchase updated successfully",
      data: updatedPurchase,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// delete purchase        DELETE: /purchases/:id
export const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid branch id" });

    const deletedPurchase = await Purchase.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deletedPurchase)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to delete" });

    res.send({
      status: true,
      message: "Purchase deleted successfully",
      data: deletedPurchase,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
