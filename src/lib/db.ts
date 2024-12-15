import mongoose, {Mongoose} from "mongoose";

import logger from "@/lib/logger";

const MONGODB_URL = process.env.DATABASE_URL as string;

if (!MONGODB_URL) throw new Error("Database URL");

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {conn: null, promise: null};
}

/**
 * Creates a cached connection to MongoDB
 * Reuses existing connection if available
 * @returns Promise<Mongoose> - Mongoose connection instance
 */
const connectDB = async () => {
  if (cached.conn) {
    logger.info("Using existing mongoose connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {dbName: "devs-overflow"})
      .then(result => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch(error => {
        logger.error("Failed to connect to MongoDB:", error);
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
