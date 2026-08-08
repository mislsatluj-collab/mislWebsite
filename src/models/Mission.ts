import mongoose from "mongoose";

const MissionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: [true, "Please provide a short description for the card"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide detailed content for the page"],
    },
    iconUrl: {
      type: String,
      required: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Mission || mongoose.model("Mission", MissionSchema);
