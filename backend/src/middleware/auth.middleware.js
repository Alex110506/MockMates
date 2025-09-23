import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt

        if(!token){
            return res.status(401).json({message:"Unathorized - No token provided"})
        }

        const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)

        if(!decode){
            return res.status(401).json({message:"Unathorized - Inwvalid token"})
        }

        const user=await User.findById(decode.userId).select("-password")
        if(!user){
            return res.status(401).json({message:"Unathorized - User not found"})
        }

        req.user=user

        next()
    } catch (error) {
        console.log("Error in protected route middleware",error);
        res.satus(500).json({message:"Internal Sserver Error"})
    }
}