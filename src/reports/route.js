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
import { AuthMiddleware } from "../users/middlewares.js";

const router = express.Router();

router.get("/receivables",AuthMiddleware, TotalReceivables);
router.get("/received",AuthMiddleware, TotalAmountReceived);
router.get("/products",AuthMiddleware, TotalProducts);
router.get("/profit",AuthMiddleware, TotalProfit);
router.get("/expenses",AuthMiddleware, totalExpenses);
router.get("/customers",AuthMiddleware, TotalCustomers);
router.get("/employees",AuthMiddleware, TotalEmployees);
router.get("/users",AuthMiddleware, TotalUsers);
router.get("/suppliers",AuthMiddleware, TotalSuppliers);
router.get("/invoices",AuthMiddleware, getLastFiveInvoices);
router.get("/employee-sales",AuthMiddleware, getEmployeeSalesReport); // Add the new route here

export default router;
