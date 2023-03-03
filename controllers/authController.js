import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

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
  res.status(StatusCodes.CREATED).json({
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
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide required field");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new UnAuthenticatedError("Email or Password is incorrect");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

const updateUser = async (req, res) => {
  res.send("Update");
};

export { register, login, updateUser };
