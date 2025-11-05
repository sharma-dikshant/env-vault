import express from "express";
import {
  createProject,
  getAllProjects,
  deleteProject,
  updateProjectSecret,
  deleteProjectSecret,
  updateProjectName,
  addEnvs
} from "../controllers/project.controller.js";

import { protect } from "../controllers/auth.controller.js";

const router = express.Router();
router.use(protect); 
router
  .get("/", getAllProjects)
  .post("/", createProject)
  .patch("/:projectId", addEnvs)
  .patch("/:projectId", updateProjectName)
  .patch("/:projectId/:secretId", updateProjectSecret)
  .delete("/:projectId/:secretId", deleteProjectSecret)
  .delete("/:projectId", deleteProject);
export default router;
