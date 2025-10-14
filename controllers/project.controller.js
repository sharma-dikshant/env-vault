import Project from "../models/projects.model.js";

export const getAllProjects = async (req, res, next) => {
  const {userId} = req.body;
  try{
    const project = await Project.find({ user: userId,isActive: false });
    if(!project){
      res.status(200).json({ message: "No project found"});
    }
    res.status(200).json({ message: "All projects", project});
  }catch(err){
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, user, secret } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    if(!user){
      return res.status(400).json({ message: "User ID is required" });
    }

    const project = await Project.create({ name, user, secret});
    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


export const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { userId, secret, name } = req.body;

    const doc = await Project.findOne({ _id: projectId, user: userId, isActive: true });
    if(!doc){
      return res.status(404).json({ message: "Project not found" });
    }
    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }
    let project = await Project.findByIdAndUpdate(projectId, { name,secret }, { new: true });
    await project.save();
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


export const deleteProject = async (req, res, next) => {
  try{
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = await Project.findOne({ _id: projectId, user: userId, isActive: true });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.isActive = false;
    await project.save();
    res.status(200).json({ message: "Project deleted successfully" });
  }catch(err){
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
