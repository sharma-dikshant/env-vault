import jwt from "jsonwebtoken";
import User from "./../models/users.model.js";

const createAccessToken = (data) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Jwt secret is not defined");
  }
  return jwt.sign(data, secret);
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: `user with email ${email} is not found`,
      });
    }

    if (password != user.password) {
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
  res.status(200).json({ message: "Logout sucess" });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await User.create({ name, email, password });
    const token = createAccessToken({ _id: newUser._id, name, email });
    res.status(200).json({
      message: "Signup sucess",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      message: "failed signup",
      error: error.message,
    });
  }
};
