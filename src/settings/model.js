import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const settingSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

settingSchema.plugin(MongoosePaginate);

settingSchema.virtual("companyInfo.logoUrl").get(function () {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (urlRegex.test(this.companyInfo.logo)) {
    return this.companyInfo.logo;
  } else {
    return process.env.UPLOAD_URL + this.companyInfo.logo;
  }
});

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
