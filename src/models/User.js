import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin","superadmin"],
      default: "user",
    },
  },
  { timestamps: true },
);
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
