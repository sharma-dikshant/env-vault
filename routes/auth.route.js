import express from "express";
import {
  loginWithPassword,
  logout,
  signup,
  loginWithGoogle,
} from "../controllers/auth.controller.js";
const router = express.Router();

router
  .post("/login", loginWithPassword)
  .post("/signup", signup)
  .post("/logout", logout)
  .post("/google", loginWithGoogle);

export default router;
