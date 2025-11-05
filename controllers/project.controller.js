import Project from "../models/projects.model.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllProjects = catchAsync(async (req, res, next) => {
  const project = await Project.find({ user: req.user._id, isActive: false });
  if (project.length == 0) {
    return res.status(200).json({ message: "No project found" });
  }
  res.status(200).json({ message: "All projects", project });
});

export const createProject = catchAsync(async (req, res, next) => {
  const { name, secret } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }

  const project = await Project.create({
    name,
    user: req.user._id,
    secret,
  });

  res.status(201).json({ message: "Project created successfully", project });
});

export const updateProjectSecret = async (req, res, next) => {
  try {
    const { projectId, secretId } = req.params;
    const secretData = req.body;
    const userId  = req.user._id;
    if (!projectId || !secretId) {
      return res
        .status(400)
        .json({ message: "Project ID and Secret ID are required" });
    }

    if (secretData.key == "" || secretData.value == "") {
      return res
        .status(400)
        .json({ message: "Secret data {key,value} pair is required" });
    }

    const project = await Project.findOne({
      _id: projectId,
      isActive: true,
      // user: userId,
    });

    if (project.length == 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const totalSecrets = project.secret.length;
    let updated = false;
    for (let i = 0; i < totalSecrets; i++) {
      if (
        project.secret[i]._id.toString() === secretId &&
        project.secret[i].isActive
      ) {
        project.secret[i].key = secretData.key || project.secret[i].key;
        project.secret[i].value = secretData.value || project.secret[i].value;
        await project.save();
        updated = true;
        return res
          .status(200)
          .json({ message: "Secret updated successfully", project });
      }
    }
    if (!updated) {
      return res.status(404).json({ message: "Some error ocurred" });
    }

  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const updateProjectName = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;
    const { userId } = req.user._id;
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }
    const project = await Project.findOne({
      _id: projectId,
      isActive: true,
      user: userId,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.name = name;
    await project.save();
    return res
      .status(200)
      .json({ message: "Project name updated successfully", project });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const addEnvs = async (req,res) => {
  try{
    const {projectId} = req.params;
    const {key,value} = req.body;

    if(!key || !value){
      return res.status(400).json({message: "Key or value is required"});
    }

    const data = {key,value};

   const newProject = await Project.findOneAndUpdate(
    {_id: projectId}, 
    { $push: { secret:data } },
    {new: true}
  );

  return res.status(200).json({message: "Added envs successfully", data: newProject});

  }catch(err){
    return res.status(500).json({message: "Internal Server Error"});
  }
}

export const deleteProjectSecret = async (req,res,next) => {
  try{
    const {projectId,secretId} = req.params;
    const { userId } = req.user._id
    if(!projectId || !secretId){
      return res.status(400).json({ message: "Project ID and Secret ID are required" });
    }
    const project = await Project.findOne({ _id: projectId, isActive: true, user: userId });
    if(!project){
      return res.status(404).json({ message: "Project not found" });
    }
    const totalSecrets = project.secret.length;
    let deleted = false;
    for(let i=0;i<totalSecrets;i++){
      if(project.secret[i]._id.toString() === secretId && project.secret[i].isActive == false){
        return res.status(404).json({ message: "Secret don't exist with this id" });
      }
      if(project.secret[i]._id.toString() === secretId){
        project.secret[i].isActive = false;
        await project.save();
        deleted = true;
        return res.status(200).json({ message: "Secret deleted successfully", project });
      }
    }
    if(!deleted){
      return res.status(404).json({ message: "Some error ocurred"});
    }
  }catch (err){
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

export const deleteProject = catchAsync(async (req, res, next) => {
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
});
