//require('dotenv').config({path: './env'})
import envConfig from "./config/env.config.js";

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// morgan
 

connectDB()
.then(() =>{
    app.listen(envConfig.PORT ||8000 ,() =>{
        console.log(`server is running at : ${process.env.port} || 8000`)
    })
})
.catch((err) =>{
    console.log("mongoDB connection faild", err );    
})
