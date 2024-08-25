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
<<<<<<< HEAD
  TotalLoan,
=======
  getPurchaseReport,
>>>>>>> e4705d42c6f8eb8bebc67120b5bd722ee817c082
} from "./controller.js";
import { AuthMiddleware } from "../users/middlewares.js";

const router = express.Router();

<<<<<<< HEAD
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
router.get("/employee-sales", getEmployeeSalesReport);
router.get("/loanreport", TotalLoan);
 // Add the new route here

router.get("/purchase-report", getPurchaseReport);
=======
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
router.get("/employee-sales",AuthMiddleware, getEmployeeSalesReport);
router.get("/purchase-report",AuthMiddleware, getPurchaseReport);
>>>>>>> 8f485eca2a11ccb76043407955f5597bd9cdcfee


export default router;
