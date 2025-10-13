export const login = (req, res, next) => {
  res.status(200).json({ message: "Login sucess" });
};

export const logout = (req, res, next) => {
  res.status(200).json({ message: "Logout sucess" });
};

export const signup = (req, res, next) => {
  res.status(200).json({ message: "Signup sucess" });
};
