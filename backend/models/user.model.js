import mongoose from "mongoose";

//object from mongoose schema
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    lastLogin:{
        type: Date,
        default: Date.now //use function reference , here date.now() we are calling the function itself meaning the date is referring to the creation of the schema not the object of the schema
        /**
         * Important Note:
Using Date.now() directly as the default value will execute the function immediately when the schema is defined, which means that the default value will be the time when the schema was created, not when a new document is instantiated.

To ensure that the default value is set to the current time each time a new document is created, you should use a function reference instead: date.now
         */
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date
    //tokens must be in users schema , either verification or password reset
},{timestamps:true});//object
//timestamps is for the createdAt and updatedAt fields to be added to the document

//now we need to make a model of this schema

export const User=mongoose.model("User",userSchema)