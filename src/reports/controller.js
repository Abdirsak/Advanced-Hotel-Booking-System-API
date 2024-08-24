import Sales from "./../sales/model.js";
import Customer from "./../customer/model.js";
import Product from "./../products/model.js";
import Invoice from "../invoices/model.js";
import Expenses from "../expenses/model.js";
import Supplier from "../supplier/model.js";
import Products from "../products/model.js";
import Employees from "../employees/model.js";
import User from "../users/model.js";
import Purchase from "../purchases/model.js";

// total amount receivable
export const TotalReceivables = async (req, res) => {
  try {
    const result = await Sales.aggregate([
      {
        $match: { balance: { $gt: 0 } }, // Match documents with balance greater than 0
      },
      {
        $group: {
          _id: null, // Group all documents together
          totalBalance: { $sum: "$balance" }, // Sum the balance field
        },
      },
    ]);

    const total = result.length > 0 ? result[0].totalBalance : 0; // Check if result exists

    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// total amounts received
export const TotalAmountReceived = async (req, res) => {
  try {
    const result = await Sales.aggregate([
      {
        $match: { balance: { $eq: 0 } }, // Match documents with balance greater than 0
      },
      {
        $group: {
          _id: null, // Group all documents together
          totalAmount: { $sum: "$totalAmount" }, // Sum the balance field
        },
      },
    ]);

    const total = result.length > 0 ? result[0].totalAmount : 0; // Check if result exists

    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// total products
export const TotalProducts = async (req, res) => {
  const total = await Products.find({}).count();
  return res.status(200).json({ total });
};
// total customers
export const TotalCustomers = async (req, res) => {
  const total = await Customer.find({}).count();
  return res.status(200).json({ total });
};
// total suppliers
export const TotalSuppliers = async (req, res) => {
  const total = await Supplier.find({}).count();
  return res.status(200).json({ total });
};
// total employees
export const TotalEmployees = async (req, res) => {
  const total = await Employees.find({}).count();
  return res.status(200).json({ total });
};
// total users
export const TotalUsers = async (req, res) => {
  const total = await User.find({}).count();
  return res.status(200).json({ total });
};
// total profit
export const TotalProfit = async (req, res) => {
  try {
    const result = await Sales.aggregate([
      { $unwind: "$salesItems" },
      {
        $lookup: {
          from: "products",
          localField: "salesItems.productId",
          foreignField: "_id",
          as: "productsData",
        },
      },
      { $unwind: "$productsData" },
      {
        $project: {
          salesCost: {
            $multiply: ["$salesItems.quantity", "$salesItems.price"],
          },
          supplierCost: {
            $multiply: ["$productsData.cost", "$salesItems.quantity"],
          },
          discount: { $ifNull: ["$discount", 0] },
          profit: {
            $subtract: [
              {
                $subtract: [
                  { $multiply: ["$salesItems.quantity", "$salesItems.price"] },
                  { $multiply: ["$productsData.cost", "$salesItems.quantity"] },
                ],
              },
              "$discount",
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$profit" },
        },
      },
    ]);

    const total = result.length > 0 ? result[0].totalProfit : 0;

    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// total expenses
export const totalExpenses = async (req, res) => {
  try {
    // Aggregate expenses by month
    const expenses = await Expenses.aggregate([
      //   {
      //     $match: { status: "paid" } // Only include "paid" expenses
      //   },
      {
        $group: {
          _id: { $month: "$date" }, // Group by month
          totalExpense: { $sum: "$amount" }, // Sum the amount field for each month
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month (ascending order)
      },
    ]);

    // Prepare a full year with all 12 months initialized to 0
    const monthsArray = [
      { month: 1, name: "January", totalExpense: 0 },
      { month: 2, name: "February", totalExpense: 0 },
      { month: 3, name: "March", totalExpense: 0 },
      { month: 4, name: "April", totalExpense: 0 },
      { month: 5, name: "May", totalExpense: 0 },
      { month: 6, name: "June", totalExpense: 0 },
      { month: 7, name: "July", totalExpense: 0 },
      { month: 8, name: "August", totalExpense: 0 },
      { month: 9, name: "September", totalExpense: 0 },
      { month: 10, name: "October", totalExpense: 0 },
      { month: 11, name: "November", totalExpense: 0 },
      { month: 12, name: "December", totalExpense: 0 },
    ];

    // Merge the aggregated results into the full year
    const total = monthsArray.map((monthData) => {
      const match = expenses.find((exp) => exp._id === monthData.month);
      return match
        ? { ...monthData, totalExpense: match.totalExpense }
        : monthData;
    });

    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPurchaseReport = async (req, res) => {
  try {
    // Aggregation pipeline without date filtering
    const report = await Purchase.aggregate([
      {
        $lookup: {
          from: 'suppliers', // The name of the Supplier collection
          localField: 'supplierId',
          foreignField: '_id',
          as: 'supplierData',
        },
      },
      {
        $unwind: {
          path: '$supplierData',
          preserveNullAndEmptyArrays: true, // Handle cases where supplier data might be missing
        },
      },
      {
        $group: {
          _id: '$supplierId', // Group by supplierId
          supplierName: { $first: '$supplierData.SupplierName' }, // Get the supplier's name
          totalAmountSpent: { $sum: '$totalAmount' }, // Calculate the total amount spent
          purchaseCount: { $sum: 1 }, // Count the number of purchases
          purchases: {
            $push: {
              purchaseDate: '$purchaseDate',
              reference: '$reference',
              orderStatus: '$orderStatus',
              paymentStatus: '$paymentStatus',
              totalAmount: '$totalAmount',
            },
          },
        },
      },
      {
        $sort: { totalAmountSpent: -1 }, // Sort by total amount spent in descending order
      },
      {
        $project: {
          _id: 0, // Hide the default _id field
          supplierId: '$_id', // Show supplier ID
          supplierName: 1,
          totalAmountSpent: 1,
          purchaseCount: 1,
          purchases: 1,
        },
      },
    ]);

    // Check if the report is empty and handle accordingly
    if (report.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No purchase records found.',
      });
    }

    return res.status(200).json({
      status: true,
      data: report,
    });
  } catch (error) {
    console.error('Error fetching purchase report:', error);
    return res.status(500).json({
      status: false,
      message: 'An error occurred while generating the purchase report.',
      error: error.message,
    });
  }
};


export const getLastFiveInvoices = async (req, res) => {
  try {
    const data = await Invoice.aggregate([
      // Apply the combined query as a match stage
      {
        $lookup: {
          from: "sales",
          localField: "sales",
          foreignField: "_id",
          as: "salesData",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "salesData.customer",
          foreignField: "_id",
          as: "customerData",
        },
      },
      { $unwind: "$salesData" },
      { $unwind: "$customerData" },

      { $limit: 5 },
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      data: {
        docs: data,
      },
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getEmployeeSalesReport = async (req, res) => {
  try {
    const result = await Sales.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $lookup: {
          from: "employees",
          localField: "userData._id",
          foreignField: "user",
          as: "employeeData",
        },
      },
      { $unwind: "$employeeData" },
      {
        $group: {
          _id: "$employeeData._id",
          name: { $first: "$employeeData.fullName" },
          totalAmount: { $sum: "$totalAmount" },
          transactions: { $sum: 1 },
          date: { $first: "$saleDate" },
        },
      },
      {
        $project: {
          employeeId: "$_id",
          name: 1,
          totalAmount: 1,
          transactions: 1,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
      { $sort: { date: -1 } },
    ]);

    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
