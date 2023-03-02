import User from "../models/User.js";

// next makes you access/pass the error handlers/middlewares, so it makes them reusable
// gives you a body of the error
const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res) => {
  res.send("login");
};

const updateUser = async (req, res) => {
  res.send("Update");
};

export { register, login, updateUser };
