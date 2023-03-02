import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";

// next makes you access/pass the error handlers/middlewares, so it makes them reusable
// gives you a body of the error
// express async errors handles it automatically for you, like the rescue_from in rails
const register = async (req, res) => {
  // get the specific value we want to access
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("please provide required field");
  }

  const userAlreadyExist = await User.findOne({ email });

  if (userAlreadyExist) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({ name, email, password });
  // create a jwt token, with the user specific ID
  const token = user.createJWT();
  // renders the selected data and filters the password out of the mongoDB table
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
  });
};

const login = async (req, res) => {
  res.send("login");
};

const updateUser = async (req, res) => {
  res.send("Update");
};

export { register, login, updateUser };
