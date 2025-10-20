import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URI = String(process.env.MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache;
}

const globalForMongoose = globalThis as unknown as {
  mongooseCache: MongooseCache;
};

if (!globalForMongoose.mongooseCache) {
  globalForMongoose.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (globalForMongoose.mongooseCache.conn) {
    return globalForMongoose.mongooseCache.conn;
  }

  if (!globalForMongoose.mongooseCache.promise) {
    globalForMongoose.mongooseCache.promise = mongoose.connect(MONGODB_URI);
  }
    globalForMongoose.mongooseCache.conn = await globalForMongoose.mongooseCache.promise;
    
  return globalForMongoose.mongooseCache.conn;
};
