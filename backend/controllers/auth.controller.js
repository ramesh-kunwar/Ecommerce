import asyncHandler from "../services/asyncHandler";
import User from "../models/user.schema";
import CustomError from "../utils/customError";
import mailHelper from "../utils/mailHelper";
import crypto from "crypto";

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
    message: "Logged Out",
  });
});

/************************************************************************
 * @FORGOT_PASSWORD
 * @route http://localhost:4000/api/auth/password/forgot
 * @description User will submit email and we will generate a token
 * @params email
 * @returns success message - email send
 *************************************************************************/

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("User not found with this email", 404);
  }

  const resetToken = user.generateForgotPasswordToken();

  // we have added token - so we have to save it
  await user.save({ validateBeforeSave: false }); // we are using validateBeforeSave: false because we are not validating the whole user object

  // send email

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/password/reset/${resetToken}`; // if we do req.params, we will get the token

  try {
    // we are doing try catch because there is a chance that mailnator() will not work or email will not be sent

    await mailHelper({
      email: user.email,
      subject: "Password Reset Token",
      text: `Your password reset token is as follows: \n\n ${resetUrl}`,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    // we have to reset the token and expiry if the email is not sent -- rollback
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new CustomError(error.message || "Email sent failure", 500);
  }
});

/************************************************************************
 * @RESET_PASSWORD
 * @route http://localhost:4000/api/auth/password/reset/:resetPasswordToken
 * @description User will be able to reset password based on url token
 * @params token from url, password and confirmPassword
 * @returns success message - password reset successful
 * *************************************************************************/

export const resetPassword = asyncHandler(async (req, res) => {
  const { token: resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  // we have encrypted the token in the model - so we have to decrypt it or again encrypt it to match it with the token in the DB

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // i want to find a user based on resetPasswordToken

  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() }, // it will check if the forgotPasswordExpiry is greater than the current date
  });

  if (!user) {
    throw new CustomError("Password token is invalid or expired", 400);
  }

  if (password !== confirmPassword) {
    throw new CustomError("Password does not match", 400);
  }

  user.password = password;
  // we have already reset the password - so we have to reset the token and expiry, we don't need them anymore - so we have to delete them
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  // create token and send it to the user
  const token = user.getJWTToken();

  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

// TODO: create a controller for changing password
