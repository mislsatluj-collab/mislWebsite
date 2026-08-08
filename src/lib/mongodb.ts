import mongoose from "mongoose";

let MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI && MONGODB_URI.includes("w=gzip")) {
  MONGODB_URI = MONGODB_URI.replace("w=gzip", "w=majority");
}

if (!MONGODB_URI) {
  console.warn("Please define the MONGODB_URI environment variable inside .env.local. Using fallback memory mode for development.");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    return null; // Gracefully fallback if not defined
  }
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
