import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connectDB";
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import dishRoute from "./routes/dish.route";
import tableRoute from "./routes/table.route";
import reservationRoute from "./routes/reservation.route";
import basketRoute from "./routes/basket.route";
import orderRoute from "./routes/order.route";
import reviewRoute from "./routes/review.route";

dotenv.config();
const app: Application = express();

connectDB();

app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: "*" }));

app.use("/user", userRoute);
app.use("/restaurant", restaurantRoute);
app.use("/dish", dishRoute);
app.use("/table", tableRoute);
app.use("/reservation", reservationRoute);
app.use("/basket", basketRoute);
app.use("/order", orderRoute);
app.use("/review", reviewRoute);

const PORT: number = parseInt(<string>process.env.PORT) || 7000;

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
