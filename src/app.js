import express from"express"
import cors from"cors"
import cookieParser from"cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORD_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '16kb'}))
app.use(express.urlencoded({extended: true , limit: '16kb'}))
app.use(express.static('public'))

app.use(cookieParser())


// routes import

import Router from "./routes/index.js";

// routes declaration

app.use("/api/v1", Router)

export { app }