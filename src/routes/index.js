import userRouter from "./routes/user.routes.js";
import { Router } from "express";

Router.use("/users", userRouter);

export default Router;

