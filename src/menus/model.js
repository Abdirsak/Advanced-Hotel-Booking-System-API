import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MenuSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
    link: {
      type: String,
      default: null,
    },
    isSection: {
      type: Boolean,
      default: false,
    },
    children: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Menu",
        },
      ],
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Menu = mongoose.model("Menu", MenuSchema);

export default Menu;
