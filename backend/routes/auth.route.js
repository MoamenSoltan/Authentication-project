//.route is optional 
import express from 'express';
import {signup,login,logout} from "../controllers/auth.controller.js"

const router=express.Router();
//all end points are here

router.post("/signup",signup)
//the callback function here is called a controller , we can make it in a separate file
router.post("/login",login)

router.post("/logout",logout)


export default router
