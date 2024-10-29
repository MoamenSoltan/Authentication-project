import mongoose from "mongoose"


export const connectDB=async ()=>{
    try {
        // console.log("MongoURI : ",process.env.MONGO_URI);
        
        const conn=await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error("error connecting to MongoDb",error.message)
        process.exit(1)//failure , 0 status code is success
    }
}