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
