//.route is optional 
import express from 'express';
import {signup,login,logout,verifyEmail,forgotPassword,resetPassword,checkAuth} from "../controllers/auth.controller.js"
import { verifyToken } from '../middleware/verifyToken.js';

const router=express.Router();
//all end points are here

router.get("/check-auth",verifyToken,checkAuth)
//check logout then checkAuth in postman
//this is a protected route , meaning we can access checkAuth only after verifyToken next() is reached , 
//any request will go through this middleware function , thats why we extract the user id from the token , to be able to use it in checkAuth which in order would be needed in every request


//if we hit this endpoint means call verifyToken , once we reach next(), we move to checkAuth method
//called in frontend whenever we refresh our page , to see if user is authenticated
//verifyToken or protectedRoute is a middleware function

router.post("/signup",signup)
//the callback function here is called a controller , we can make it in a separate file
router.post("/login",login)

router.post("/logout",logout)

router.post("/verify-email",verifyEmail)

router.post("/forgot-password",forgotPassword)

router.post("/reset-password/:token",resetPassword)//stored in req.params
//appended token for security // the :token is a placeholder  , the resetpassword function extracts this token and compares it against the token in the DB



export default router
