import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

const PORT = 3000;
const db_url = "mongodb://localhost:27017/env_vault";

mongoose
  .connect(db_url)
  .then(() => {
    console.log("db connect");
  })
  .catch(() => console.log("failed to connect db"));

app.listen(PORT, () => {
  console.log(`App is running on post ${PORT}`);
});
