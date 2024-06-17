import { validationResult } from "express-validator";
import Branch from "./model.js";
import { isValidObjectId } from "mongoose";
import { getAll } from "../utils/query.js";

// export const getBranches = getAll(Branch);
export const getBranches = async (req, res) => {
  try {
    const { options, query = {}, search = {} } = req.query;

    // Construct search criteria if search keyword and fields are provided
    const { keyword, fields = [] } = search;
    let searchCriteria = {};

    if (keyword && fields.length) {
      const searchFields = Array.isArray(fields) ? fields : [fields];
      searchCriteria = {
        $or: searchFields.map((field) => ({
          [field]: { $regex: keyword, $options: "i" },
        })),
      };
    }

    // Merge the search criteria with the provided query
    const combinedQuery = { ...query, ...searchCriteria };

    // Set up the options for pagination, including the populate option if provided
    let paginationOptions = { ...options };

    // Adding population options
    paginationOptions.populate = [
      { path: 'director' }
    ];

    // Execute the paginate function with the combined query and options
    const data = await Branch.paginate(combinedQuery, paginationOptions);

    return res.status(200).json({ data, status: true });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const createBranch = async (req, res) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length) throw new Error(errors[0]?.msg);

    const branch = await Branch.create(req.body);

    res.status(201).send({
      status: true,
      message: "branch created successfully",
      data: branch,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid branch id" });

    const updatedBranch = await Branch.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!updatedBranch)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to update" });

    res.status(201).send({
      status: true,
      message: "Branch updated successfully",
      data: updatedBranch,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res
        .status(400)
        .json({ status: false, message: "Invalid branch id" });

    const deletedBranch = await Branch.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    if (!deletedBranch)
      return res
        .status(400)
        .json({ status: false, message: "Invalid action, Nothing to delete" });

    res.send({
      status: true,
      message: "branch deleted successfully",
      data: deletedBranch,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
