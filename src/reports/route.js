import express from "express";
import {
    TotalAmountReceived,
  TotalProducts,
  TotalReceivables,
  TotalProfit,
  totalExpenses,
  TotalSuppliers,
  TotalUsers,
  TotalEmployees,
  TotalCustomers,
getLastFiveInvoices
  
} from "./controller.js";

const router = express.Router();

router.get("/receivables", TotalReceivables);
router.get("/received", TotalAmountReceived);
router.get("/products", TotalProducts);
router.get("/profit", TotalProfit);
router.get("/expenses", totalExpenses);
router.get("/customers", TotalCustomers);
router.get("/employees", TotalEmployees);
router.get("/users", TotalUsers);
router.get("/suppliers", TotalSuppliers);
router.get("/invoices", getLastFiveInvoices);


export default router;
