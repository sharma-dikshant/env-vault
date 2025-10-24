import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import projectRouter from "./routes/project.route.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/projects", projectRouter);
app.use("/", (req, res) => {
  res.status(200).json({
    message: "success",
  });
});

app.get("/", () => {
  console.log("welcome");
});

app.use((err, req, res, next) => {
  return res.status(500).json({
    message: err.message
  })
})

export default app;
