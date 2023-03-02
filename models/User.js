import mongoose from "mongoose";
// add validator to the inputs
import validator from "validator";

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

// create the user collection in the mongoDB
export default mongoose.model("User", UserSchema);
