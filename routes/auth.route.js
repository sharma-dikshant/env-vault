import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/login", login).post("/signup", signup).post("/logout", logout);

export default router;
