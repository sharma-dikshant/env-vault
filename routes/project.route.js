import express from "express";
import {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { protect } from "../controllers/auth.controller.js";
const router = express.Router();

router
  .get("/", protect, getAllProjects)
  .post("/", protect, createProject)
  .patch("/:projectId", protect, updateProject)
  .delete("/:projectId", protect, deleteProject);

export default router;
