import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.config";
import foodRouter from "./routers/food.router";
import userRouter from "./routers/user.router";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: ["http://localhost:4200"] }));

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Connection On http://localhost:" + PORT);
});
