import express from "express";
import { createProject, getAllProjects, updateProject, deleteProject } from "../controllers/project.controller.js";
const router = express.Router();

router
  .get("/", getAllProjects)
  .post("/", createProject)
  .patch("/:projectId", updateProject)
  .delete("/:projectId", deleteProject);

export default router;
