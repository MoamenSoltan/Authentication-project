// const express = require('express');
//type module in pakage.json   
//notes : use diagrams to explain flow of api calls 
import express from 'express';
import { connectDB } from './DB/connectDB.js';
//dont forget .js for connedctDB because its a local file
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
import dotenv from 'dotenv';
import path from "path"
dotenv.config()
// to be able to read the environment variables , by default its not accessible



 const app = express();
 const PORT=process.env.PORT || 5000
 const __dirname = path.resolve()
 //we used nodemon to not be forced to restart the server every time
 //use npm run dev 

 app.use(cors({origin:"http://localhost:5173",credentials:true}))// to allow cross-origin requests from other domains
 app.use(express.json())//allow us to parse the incoming requests with json payloads , : req.body
 app.use(cookieParser())// to parse the cookies that are sent by the client with each request
 app.use("/api/auth",authRoutes)
  //this line means that we prefex all our routes from authRoutes with /api/auth


//deployment
  if(process.env.NODE_ENV === 'production'){
   app.use(express.static(path.join(__dirname,"/frontend/dist")))

   app.get("*",(req,res)=>{
     res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
   })
   //the frontend folder should be built before deploying to production, using npm run build
  }

 app.listen(PORT,()=>{
    connectDB()
    console.log('Server is running on port :',PORT);
 })
//moamensoltan
 //yNP7aOXNqDoqXLfm
 //connection string from mongoDB in .env file