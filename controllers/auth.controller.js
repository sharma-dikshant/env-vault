import jwt from "jsonwebtoken";
import User from "./../models/users.model.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createAccessToken = (data) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Jwt secret is not defined");
  }
  return jwt.sign(data, secret);
};

export const loginWithPassword = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password)
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: `user with email ${email} is not found`,
      });
    }

    if (!user.correctPassword(password)) {
      return res.status(403).json({
        message: "invalid password",
      });
    }

    const token = createAccessToken({ _id: user._id, name: user.name, email });
    return res.status(200).json({
      message: "login success",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const logout = (req, res, next) => {
  res.status(200).json({ message: "Logout sucess", token: "invalid" });
};

export const signup = async (req, res, next) => {
  const { name, email, password, google_id } = req.body;
  try {
    const newUser = await User.create({ name, email, password, google_id });
    const token = createAccessToken({ _id: newUser._id, name, email });
    res.status(200).json({
      message: "Signup sucess",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "failed signup",
      error: error.message,
    });
  }
};

export const loginWithGoogle = async (req, res, next) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res
      .status(400)
      .json({ message: "failed login", error: "token is not given" });
  }
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log(idToken, ticket)
    const payload = ticket.getPayload();

    console.log(payload)
    const token = createAccessToken({
      name: payload.name,
      email: payload.email,
    });

    return res.status(200).json({
      message: "success loged in",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
