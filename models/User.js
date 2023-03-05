import mongoose from "mongoose";
// add validator to the inputs
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create schema for user details for the profile page

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address",
    },
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    // hide the password
    select: false,
  },

  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "lastName",
  },

  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "New York",
  },
});

// hook that gets called before we save the document
// Use anonymous function instead of arrow function to access outside properties
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  // salt adds random characters to make the password more secure
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// create the user collection in the mongoDB
// We called the table to be User in the mongoDB table
export default mongoose.model("User", UserSchema);
