import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connectDB";
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";

dotenv.config();
const app: Application = express();

connectDB();

app.use(express.json({ limit: "1mb" }));
// app.use(cors({ origin: process.env.CLIENT }));

app.use("/user", userRoute);
app.use("/restaurant", restaurantRoute);

const PORT: number = parseInt(<string>process.env.PORT) || 7000;

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
