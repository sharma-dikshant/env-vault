import express from "express";
import {
  loginWithPassword,
  logout,
  signup,
  loginWithGoogle,
} from "../controllers/auth.controller.js";
import { protect } from "../controllers/auth.controller.js";
const router = express.Router();

router
  .post("/login", loginWithPassword)
  .post("/signup", signup)
  .post("/logout", logout)
  .post("/google", loginWithGoogle)
  .get("/me", protect, (req, res) => {
    return res.status(200).json({
      message: "user fetched",
      user: req.user,
    });
  });

export default router;
