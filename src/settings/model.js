import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const settingSchema = new Schema({
  companyInfo: {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
});

settingSchema.plugin(MongoosePaginate);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
