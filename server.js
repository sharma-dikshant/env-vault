import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import mongoose from "mongoose";


const PORT = 3000;
const db_url = process.env.MONGO_URL;

if (!db_url) {
  throw new Error("Db url not found");
}

mongoose
  .connect(db_url)
  .then(() => {
    console.log("db connect");
  })
  .catch(() => console.log("failed to connect db"));

app.listen(PORT, () => {
  console.log(`App is running on post ${PORT}`);
});
