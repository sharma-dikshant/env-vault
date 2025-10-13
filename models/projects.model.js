import mongoose from "mongoose";
d;
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    secret: [
      {
        key: {
          type: String,
          required: [true, "Secret is required"],
        },
        value: {
            type: String,
            required: [true, "Value is required"]
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
