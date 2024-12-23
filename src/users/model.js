import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import MongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;
// Define the User schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    
    role:{
      type: Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

// Check if password is correct
UserSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.plugin(MongoosePaginate);

// Export the User model
const User = mongoose.model("User", UserSchema);

export default User;
