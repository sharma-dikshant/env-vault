export const getAllProjects = (req, res, next) => {
  res.status(200).json({ message: "getAllProjects sucess" });
};

export const createProject = (req, res, next) => {
  res.status(200).json({ message: "LogcreateProjectin sucess" });
};

export const updateProject = (req, res, next) => {
  res.status(200).json({ message: "updateProject sucess" });
};

export const deleteProject = (req, res, next) => {
  res.status(200).json({ message: "deleteProject sucess" });
};
