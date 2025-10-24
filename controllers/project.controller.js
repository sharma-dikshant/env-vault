import Project from "../models/projects.model.js";

export const getAllProjects = async (req, res, next) => {
  try {
    const project = await Project.find({ user: req.user._id, isActive: false });
    if (!project) {
      res.status(200).json({ message: "No project found" });
    }
    res.status(200).json({ message: "All projects", project });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, secret } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      user: req.user._id,
      secret: [],
    });

    if (Array.isArray(secret) && secret.length > 0) {
      for (let i = 0; i < secret.length; i++) {
        const s = secret[i];
        if (s.key && !s.value) {
          return res
            .status(400)
            .json({ message: "Value is required if key is provided" });
        }
        if (s.value && !s.key) {
          return res
            .status(400)
            .json({ message: "Key is required if value is provided" });
        }
        project.secret.push({ key: s.key, value: s.value });
      }

      await project.save();
    }

    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { secret, name } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!Array.isArray(secret) || secret.length === 0) {
      project.secret = [];
    }

    if (Array.isArray(secret) && secret.length > 0) {
      secret.forEach((s) => {
        if (s.key && !s.value) {
          throw new Error("Value is required if key is provided");
        }
        if (s.value && !s.key) {
          throw new Error("Key is required if value is provided");
        }

        if ("_id" in s) {
          const subdoc = project.secret.id(s._id);
          if (subdoc) {
            subdoc.key = s.key;
            subdoc.value = s.value;
          }
        } else {
          project.secret.push({ key: s.key, value: s.value });
        }
      });
    }

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }
    project.name = name;
    await project.save();

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
      isActive: true,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.isActive = false;
    await project.save();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
