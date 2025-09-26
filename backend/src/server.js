import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { Server } from "socket.io";
import http from "http"
dotenv.config()
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import DocumentModel from "./models/Document.js";

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


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" 
      ? true
      : "http://localhost:5173",
    credentials: true,
  },
});


const defaultValue=""

io.on("connection",socket=>{
    socket.on("get-document",async documentId=>{
        const document=await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit("load-document",document.data)

        socket.on("send-changes",delta=>{
            socket.broadcast.to(documentId).emit("recive-changes",delta)
        })

        socket.on("save-document",async data=>{
            await DocumentModel.findByIdAndUpdate(documentId,{data})
        })
    })
    
})

async function findOrCreateDocument(id){
    if(id==null) return;
    const document=await DocumentModel.findById(id);

    if(document)
        return document
    return DocumentModel.create({_id:id,data:defaultValue})
}

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname+"/../frontend/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname+"/../frontend/dist/index.html"))
    })
}

server.listen(PORT,()=>{
    console.log(`listnening on port ${PORT}...`);
    connectDb();
})