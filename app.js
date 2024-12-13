import express from "express";
import dotenv from "dotenv";
import usersRouter from "./src/routes/users.routes.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import initializePassport from "./src/config/passport.config.js";
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
initializePassport();
app.listen(process.env.PORT, () => {
  console.log("Conectado al puerto " + process.env.PORT);
});
mongoose.connect(process.env.MONGO);
app.use("/api/users", usersRouter);
