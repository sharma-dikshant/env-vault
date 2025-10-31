import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import projectRouter from "./routes/project.route.js";
import cors from "cors";

const app = express();

const allowedOrigins = ["http://localhost:5678", "http://localhost:5173"];

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/auth", authRouter);
app.use("/projects", projectRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "welcome" });
});

app.use((err, req, res, next) => {
  return res.status(500).json({
    message: err.message,
  });
});

export default app;
