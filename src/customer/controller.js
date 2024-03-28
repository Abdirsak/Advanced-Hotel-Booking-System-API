import { validationResult } from "express-validator";
import Customer from "./model.js"
import { isValidObjectId } from "mongoose";


// 
export const getCustomer = async (req, res) => {
   try {
      const Customers = await Customer.find({});
      res.send({ status: true, data: Customers })
   } catch (err) {
      res.status(500).json({ status: false, message: err.message })
   }
}

export const createCustomer = async (req, res) => {
   try {
      const { error } = validationResult(req);
      if (error.length) throw new Error(error[0]?.msg);

      const customer = await Customer.create(req.body);

      res.status(201).send({
         status: true,
         message: "customer created is successfully...",
         data: customer
      })

   } catch (err) {
      res.status(400).json({ status: false, message: err.message })
   }
}

export const updateCustomer = async (req, res) => {
   try {
      const { id } = req.params;
      if (!isValidObjectId(id))
         return res.status(400).json({ status: false, message: "invalid customer Id" });

      const updateCustom = await Customer.findOneAndUpdate({ _id: id }, req.body, {
         new: true
      });

      if (!updateCustom)
         return res
            .status(400)
            .json({ status: false, message: "invalid action, nothing updated" });
      res.status(201).send({
         status: true,
         message: "custom updated successfully..",
         data: updateCustom
      })
   } catch (err) {
      res.status(500).json({ status: false, message: err.message })
   }

}


export const deleteCustomer = async (req, res) => {
   try {
      const { id } = req.params;
      if (!isValidObjectId(id))
         return res.status(400).json({ status: false, message: "invalid customer id" });

      const deleteCustom = await Customer.findOneAndDelete({ _id: id }, { new: true });
      if (!deleteCustom)
         return res
            .status(400)
            .json({ status: false, message: "invalid Action, nothing to deleted" });

      res.status(201).send({
         status: true,
         data: deleteCustom,
         message: "custome deleted successfully..."
      })
   } catch (err) {
      res.status(500).json({ status: false, message: err.message })
   }

}
