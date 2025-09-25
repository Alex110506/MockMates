import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
dotenv.config()
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"

import { connectDb } from "./lib/db.js";

const app=express();
const PORT=process.env.PORT

const __dirname=path.resolve()

app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? true // allow same-origin in production
    : "http://localhost:5173",
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chat",chatRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname+"/../frontend/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname+"/../frontend/dist/index.html"))
    })
}

app.listen(PORT,()=>{
    console.log(`listnening on port ${PORT}...`);
    connectDb();
})