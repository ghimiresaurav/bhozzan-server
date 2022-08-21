import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";

import register from "./Controllers/register";

dotenv.config();

//import controllers

const app: Application = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT }));

app.post("/register", register);
// app.post("/login", login);

const PORT: number = parseInt(<string>process.env.PORT) || 5000;

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
