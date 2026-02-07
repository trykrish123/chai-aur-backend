//require('dotenv').config({path: './env'})
import {env} from "./config/env.config.js";

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// morgan
 

connectDB()
.then(() =>{
    app.listen(env.PORT ||8000 ,() =>{
        console.log(`server is running at : ${env.PORT} || 8000`)
    })
})
.catch((err) =>{
    console.log("mongoDB connection faild", err );    
})
