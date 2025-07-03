import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const conectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error al coneectar a MongoDB", error.message);
        process.exit(1);
    }
  }

  export default conectDB;
  