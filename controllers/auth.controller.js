import jwt from "jsonwebtoken";
import User from "./../models/users.model.js";
import { OAuth2Client } from "google-auth-library";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const secret = process.env.JWT_SECRET;

const createAccessToken = (data) => {
  if (!secret) {
    throw new Error("Jwt secret is not defined");
  }
  return jwt.sign(data, secret);
};

const verifyToken = (token) => {
  if (!token) {
    throw new Error("no access token");
  }
  return jwt.verify(token, secret);
};

export const loginWithPassword = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(404, `no user with given email ${email}`));
  }

  if (!user.correctPassword(password)) {
    return next(new AppError(403, "invalid password"));
  }

  const token = createAccessToken({ _id: user._id, name: user.name, email });
  res.cookie("authToken", token, {
    maxAge: 20 * 24 * 60 * 60 * 60,
  });

  return res.status(200).json({
    message: "login success",
    token,
  });
});

export const logout = (req, res, next) => {
  res.status(200).json({ message: "Logout sucess", token: "invalid" });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, google_id } = req.body;
  const newUser = await User.create({ name, email, password, google_id });
  const token = createAccessToken({ _id: newUser._id, name, email });
  res.cookie("authToken", token, {
    maxAge: 20 * 24 * 60 * 60 * 60,
  });
  res.status(200).json({
    message: "Signup sucess",
    token,
  });
});

export const loginWithGoogle = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;
  if (!idToken) {
    return next(new AppError(400, "no token given"));
  }
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const token = createAccessToken({
    name: payload.name,
    email: payload.email,
  });
  res.cookie("authToken", token, {
    maxAge: 20 * 24 * 60 * 60 * 60,
  });
  return res.status(200).json({
    message: "success loged in",
    token,
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token = "";
  if (req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(403, "you're not authenticated. Please login to continue.")
    );
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    return next(new AppError(403, "invalid token"));
  }
});
