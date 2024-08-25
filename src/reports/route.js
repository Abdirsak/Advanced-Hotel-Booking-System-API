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
  getLastFiveInvoices,
  getEmployeeSalesReport,

} from "./controller.js";

const router = express.Router();

router.get("/receivables", TotalReceivables);