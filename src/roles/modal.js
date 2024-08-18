import mongoose from "mongoose";
const Schema = mongoose.Schema;
import MongoosePaginate from "mongoose-paginate-v2";

// Define the Role schema
const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    abilities: [
      {
        subject: {
          type: String,
          required: true,
        },
        action: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

RoleSchema.plugin(MongoosePaginate);

// Export the Role model
const Role = mongoose.model("Role", RoleSchema);

export default Role;
