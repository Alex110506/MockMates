import express from 'express';
import { signup,login,logout, onboard } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router=express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

router.post("/onboarding",protectedRoute,onboard)

//check if user is logged in or not
router.get("/me",protectedRoute,(req,res)=>{
    console.log(req.user)
    res.status(200).json({success:true,user:req.user})
})

export default router