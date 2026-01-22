//require('dotenv').config({path: './env'})
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";



connectDB()
.then(() =>{
    app.listen(process.env.PORT ||8000 ,() =>{
        console.log(`server is running at : ${process.env.port} || 8000`)
    })
})
.catch((err) =>{
    console.log("mongoDB connection faild", err );    
})
