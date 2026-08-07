import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      required: [true, "Please provide an excerpt"],
      maxlength: [200, "Excerpt cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    imageUrl: {
      type: String,
      required: false,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
