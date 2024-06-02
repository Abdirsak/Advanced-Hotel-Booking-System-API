import { isValidObjectId } from "mongoose";

export const getAll = (Model) => async (req, res) => {
  try {
    // Validate if the passed parameter is a Mongoose model with paginate function
    if (!Model?.paginate) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid model provided" });
    }

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

    // Execute the paginate function with the combined query and options
    const data = await Model.paginate(combinedQuery, options);
    return res.json({ status: true, data });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

export const getSingle = (Model) => async (req, res, next) => {
  try {
    // Check if the passed parameter is a Mongoose model
    if (!Model || typeof Model.findById !== "function") {
      return res
        .status(400)
        .json({ status: false, message: "Invalid model provided" });
    }
    if (!isValidObjectId(req.params.id))
      throw new Error("Invalid Document ID provided");

    const { id } = req.params; // Assuming the id is passed in the request parameters
    let query = Model.findById(id);

    // Check if populate options are provided
    if (req.query.populate) {
      const populateOptions = JSON.parse(req.query.populate); // Assuming populate options are provided in query string
      query = query.populate(populateOptions);
    }

    const document = await query.exec();

    if (!document) {
      return res
        .status(404)
        .json({ status: false, message: "Document not found" });
    }

    res.send({ status: true, data: document });
  } catch (err) {
    next(err);
  }
};

export const createDocument = (Model) => async (req, res, next) => {
  try {
    // Check if the passed parameter is a Mongoose model
    if (!Model || typeof Model.create !== "function") {
      return res
        .status(400)
        .json({ status: false, message: "Invalid model provided" });
    }

    const document = await Model.create({
      ...req.body,
      createdBy: req?.user?._id,
    });

    res.status(201).json({ status: true, data: document });
  } catch (err) {
    next(err);
  }
};

export const updateDocument = (Model) => async (req, res, next) => {
  try {
    // Check if the passed parameter is a Mongoose model
    if (!Model || typeof Model.findByIdAndUpdate !== "function") {
      return res
        .status(400)
        .json({ status: false, message: "Invalid model provided" });
    }

    if (!isValidObjectId(req.params.id))
      throw new Error("Invalid Document ID provided");

    const updatedDocument = await Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedDocument) {
      return res
        .status(404)
        .json({ status: false, message: "Document not found" });
    }

    res.send({ status: true, data: updatedDocument });
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = (Model) => async (req, res, next) => {
  try {
    // Check if the passed parameter is a Mongoose model
    if (!Model || typeof Model.findByIdAndDelete !== "function") {
      return res
        .status(400)
        .json({ status: false, message: "Invalid model provided" });
    }
    if (!isValidObjectId(req.params.id))
      throw new Error("Invalid Document ID provided");

    const deletedDocument = await Model.findByIdAndDelete(req.params.id);

    if (!deletedDocument) {
      return res
        .status(404)
        .json({ status: false, message: "Document not found" });
    }

    res.send({ status: true, message: "Document deleted successfully" });
  } catch (err) {
    next(err);
  }
};
