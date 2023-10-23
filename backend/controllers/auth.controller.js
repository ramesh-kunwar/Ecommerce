import asyncHandler from "../services/asyncHandler";
import User from "../models/user.schema";
import CustomError from "../utils/customError";

export const cookieOptions = {
  expire: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,

  // could be in separate file in utils
};

/************************************************************************
 * @SIGNUP
 * @route http://localhost:4000/api/auth/signup
 * @description User signup controller for creating a new user
 * @params name, email, password
 * @returns User object
 *************************************************************************/

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError("Pleas fill all fields", 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJWTToken();

  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    user,
    token,
  });
});

/************************************************************************
 * @LOGIN
 * @route http://localhost:4000/api/auth/login
 * @description User signin controller
 * @params email, password
 * @returns User object
 *************************************************************************/

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError("Pleas fill all fields", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  if (!(user && (await user.comparePassword(password)))) {
    throw new CustomError("Invalid credentials", 400);
  }

  const token = user.getJWTToken();
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    user,
    token,
  });
});

/************************************************************************
 * @LOGIN
 * @route http://localhost:4000/api/auth/logout
 * @description User logout by clearing user cookie
 * @params
 * @returns success message
 *************************************************************************/

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out"
  });
});
