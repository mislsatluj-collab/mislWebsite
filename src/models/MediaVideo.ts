import mongoose from "mongoose";

const MediaVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    youtubeUrl: {
      type: String,
      required: [true, "Please provide a YouTube URL"],
    },
    description: {
      type: String,
      default: "",
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.MediaVideo || mongoose.model("MediaVideo", MediaVideoSchema);
