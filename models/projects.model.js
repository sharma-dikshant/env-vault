import mongoose from "mongoose";
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
    isActive:{
      type:Boolean,
      default:true,
    }
  },
  {
    timestamps: true,
  }
);
projectSchema.pre(/^find/, function (next) {
  this.where({ isActive: true });
  next();
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
