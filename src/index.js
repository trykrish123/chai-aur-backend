//require('dotenv').config({path: './env'})
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";



connectDB()
