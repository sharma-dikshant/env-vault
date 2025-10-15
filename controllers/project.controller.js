import Project from "../models/projects.model.js";

export const getAllProjects = async (req, res, next) => {
  const {userId} = req.body;
  try{
    const project = await Project.find({user: userId});
    if(!project){
      res.status(200).json({ message: "No project found"});
    }
    res.status(200).json({ message: "All projects", project});
  }catch(err){
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const createProject = async (req, res, next) => {
  const {name,key,value,userId} = req.body;
  if(!name){
    return res.status(400).json({ message: "Project name is required"});
  }
  if(key && !value){
    return res.status(400).json({ message: "Value is required if key is provided"});
  }
  if(value && !key){
    return res.status(400).json({ message: "Key is required if value is provided"});
  }

  try{
    const savedProject = await Project.create({name,secret: [{ key, value}], user: userId});
    res.status(201).json({ message: "Project created successfully", project: savedProject });
  }catch(err){
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const updateProject = (req, res, next) => {
  try{
  const { projectId } = req.params;
  if(!projectId){
    res.status(400).json({ message: "Project ID is required"});
  }
  const {name,secret} = req.body;

  if(!name){
    return res.status(400).json({ message: "Project name is required"});
  }

  if(Array.isArray(secret) && secret.length > 0){
    for(let i=0; i<secret.length; i++){
      if(secret[i].key && secret[i].value && secret[i]._id){
        Project.findByIdAndUpdate();
      }
  }
}

  const updatedProject = findByIdAndUpdate(projectId, {name, secret: [{key, value}]}, {new: true});
  if(!updatedProject){
    return res.status(500).json({ message: "Project can't be updated"});
  }
  res.status(200).json({ message: "Project is updated successfully", project: updatedProject });
  }catch(err){
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const deleteProject = (req, res, next) => {
  res.status(200).json({ message: "deleteProject sucess" });
};
