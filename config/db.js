import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const conectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error al conectar a MongoDB", error.message);
    process.exit(1);
  }
};

export default conectDB;
