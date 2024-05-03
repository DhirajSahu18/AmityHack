import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const Connection = async () => {
  const MongoURI =
    process.env.MONGO_URL;

  try {
    await mongoose.connect(MongoURI);
    console.log("Database connection successful");
  } catch (error) {
    console.log("Mongoose Connection error", error?.message);
  }
};

export default Connection