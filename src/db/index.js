import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () =>{
    try {
        const connectionInstances = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n Mongo DB connected and connection Instances ${connectionInstances.connection.host}`);
    } catch (error) {
        console.log("MongoDB Error ",error);
        process.exit(1);
    }
}

export default connectDB;