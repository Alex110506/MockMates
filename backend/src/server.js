import express from "express";
import dotenv from "dotenv"
dotenv.config()

import authRoutes from "./routes/auth.route.js"
import { connectDb } from "./lib/db.js";

const app=express();
const PORT=process.env.PORT

app.use(express.json())

app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
    console.log(`listnening on port ${PORT}...`);
    connectDb();
})