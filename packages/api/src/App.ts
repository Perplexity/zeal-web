import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import BaseRouter from "../src/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api", BaseRouter);

export default app;