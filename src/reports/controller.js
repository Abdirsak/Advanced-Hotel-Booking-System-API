import Sales from "./../sales/model.js";
import Customer from './../customer/model.js';
import Product from './../products/model.js';
import Invoice from "../invoices/model.js";
import Expenses from "../expenses/model.js";
import Supplier from "../supplier/model.js";
import Products from "../products/model.js";
import Employees from "../employees/model.js";
import User from "../users/model.js";

// total amount receivable 
export const TotalReceivables = async (req, res) => {
    try {
      const result = await Sales.aggregate([
        {
          $match: { balance: { $gt: 0 } } // Match documents with balance greater than 0
        },
        {
          $group: {
            _id: null, // Group all documents together
            totalBalance: { $sum: "$balance" } // Sum the balance field
          }
        }
      ]);
  
      const total = result.length > 0 ? result[0].totalBalance : 0; // Check if result exists
  
      return res.status(200).json({ total });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
}
// total amounts received
export const TotalAmountReceived = async (req, res) => {
    try {
      const result = await Sales.aggregate([
        {
          $match: { balance: { $eq: 0 } } // Match documents with balance greater than 0
        },
        {
          $group: {
            _id: null, // Group all documents together
            totalAmount: { $sum: "$totalAmount" } // Sum the balance field
          }
        }
      ]);
  
      const total = result.length > 0 ? result[0].totalAmount : 0; // Check if result exists
  
      return res.status(200).json({ total });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
}
// total products
export const TotalProducts = async(req,res)=>{
    const total = await Products.find({}).count();
    return res.status(200).json(total)
}
// total customers
export const TotalCustomers = async(req,res)=>{
    const total = await Customer.find({}).count();
    return res.status(200).json(total)
}
// total suppliers
export const TotalSuppliers = async(req,res)=>{
    const total = await Supplier.find({}).count();
    return res.status(200).json(total)
}
// total employees
export const TotalEmployees = async(req,res)=>{
    const total = await Employees.find({}).count();
    return res.status(200).json(total)
}
// total users
export const TotalUsers = async(req,res)=>{
    const total = await User.find({}).count();
    return res.status(200).json(total)
}
// total profit
export const TotalProfit = async (req, res) => {
    try {
      const result = await Sales.aggregate([
        {$unwind:"$salesItems"},
        {$lookup:{
            from:"products",
            localField:"salesItems.productId",
            foreignField:"_id",
            as:"productsData"
        }},
        {$unwind:"$productsData"},
        {
          $project: {
            salesCost: { $multiply: ["$salesItems.quantity", "$salesItems.price"] },
            supplierCost: { $multiply: ["$productsData.cost", "$salesItems.quantity"] },
            discount: { $ifNull: ["$discount", 0] },
            profit: {
              $subtract: [
                { $subtract: [{ $multiply: ["$salesItems.quantity", "$salesItems.price"] }, { $multiply: ["$productsData.cost", "$salesItems.quantity"] }] },
                "$discount"
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            totalProfit: { $sum: "$profit" }
          }
        }
      ]);
  
      const total = result.length > 0 ? result[0].totalProfit : 0;
  
      return res.status(200).json({ totalProfit: total });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  

// total expenses 
export const totalExpenses = async(req,res)=>{
    try {
        // Aggregate expenses by month
        const expenses = await Expenses.aggregate([
        //   {
        //     $match: { status: "paid" } // Only include "paid" expenses
        //   },
          {
            $group: {
              _id: { $month: "$date" }, // Group by month
              totalExpense: { $sum: "$amount" } // Sum the amount field for each month
            }
          },
          {
            $sort: { "_id": 1 } // Sort by month (ascending order)
          }
        ]);
    
        // Prepare a full year with all 12 months initialized to 0
        const monthsArray = [
          { month: 1, name: 'January', totalExpense: 0 },
          { month: 2, name: 'February', totalExpense: 0 },
          { month: 3, name: 'March', totalExpense: 0 },
          { month: 4, name: 'April', totalExpense: 0 },
          { month: 5, name: 'May', totalExpense: 0 },
          { month: 6, name: 'June', totalExpense: 0 },
          { month: 7, name: 'July', totalExpense: 0 },
          { month: 8, name: 'August', totalExpense: 0 },
          { month: 9, name: 'September', totalExpense: 0 },
          { month: 10, name: 'October', totalExpense: 0 },
          { month: 11, name: 'November', totalExpense: 0 },
          { month: 12, name: 'December', totalExpense: 0 }
        ];
    
        // Merge the aggregated results into the full year
        const result = monthsArray.map(monthData => {
          const match = expenses.find(exp => exp._id === monthData.month);
          return match ? { ...monthData, totalExpense: match.totalExpense } : monthData;
        });
    
        return res.status(200).json(result);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
}