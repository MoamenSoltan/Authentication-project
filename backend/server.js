// const express = require('express');
//type module in pakage.json   
//notes : use diagrams to explain flow of api calls 
import express from 'express';
import { connectDB } from './DB/connectDB.js';
//dont forget .js for connedctDB because its a local file
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
dotenv.config()
// to be able to read the environment variables , by default its not accessible



 const app = express();
 const PORT=process.env.PORT || 5000

 //we used nodemon to not be forced to restart the server every time
 //use npm run dev 

 app.use(express.json())//allow us to parse the incoming requests with json payloads , : req.body
 app.use(cookieParser())// to parse the cookies that are sent by the client with each request
 app.use("/api/auth",authRoutes)
  //this line means that we prefex all our routes from authRoutes with /api/auth


 app.listen(PORT,()=>{
    connectDB()
    console.log('Server is running on port :',PORT);
 })
//moamensoltan
 //yNP7aOXNqDoqXLfm
 //connection string from mongoDB in .env file