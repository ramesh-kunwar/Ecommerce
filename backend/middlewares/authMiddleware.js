import User from "../models/user.schema";
import CustomError from "../utils/customError";
import asyncHandler from "../middlewares/asyncHandler";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const isLoggedin = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.cookies.token ||
    req.headers.authorization ||
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new CustomError("Not authorized to access this route", 401);
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // find a user and assign to req.user
    req.user = await User.findById(decoded._id, "name email role"); // select only name, email, role
    next();
  } catch (error) {
    throw new CustomError("Not authorized to access this resource", 401);
  }
});
