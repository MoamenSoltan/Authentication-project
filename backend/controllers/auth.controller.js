import { User } from "../models/user.model.js"
import bcryptjs from  "bcryptjs"
import { generateVerificationCode } from "../utils/generateVerificationCode.js"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import {sendVerificationEmail, sendWelcomeEmail} from "../mailtrap/emails.js"

export const signup = async (req, res) => {
    //use postman
    const {email,password,name}=req.body//this is what will be sent by front end (also used in postman)

   try {
    if (!email || !password || !name) {
        throw new Error("All fields must be provided")//will be handled in catch statement

        //you can handling errors here in 2 ways , either by 
        //1-throwing an error then handling the error in the catch statement ,
        //2- or by returning a response
    // return res.status(400).json({success:false,message: ""})

   }

   const userAlreadyExists = await User.findOne({email})//email:email
   //find if user is already available by using the findOne operation on the User schema

   if (userAlreadyExists) {
        
        
        throw new Error("User already exists")
        // return res.status(400).json({success: false, message:"User already exists"})
   }

   const hashedPassword=await bcryptjs.hash(password,10)
   //if password is 12345 => hashedPassword is something like @$@*sdsdjans231


   const verificationToken=generateVerificationCode()//different from jwt token


   //creating a user by making an object of the user schema
   const user = new User ({
    email,
    password: hashedPassword,
    name,
    verificationToken,
    verificationTokenExpiresAt: Date.now() +24*60*60*1000//24 hours
   })

   await user.save()//save the user to the database
   //after saving user its time to use jwt to make a token in order to authenticate user , after creating the token , send a verification email

   /**
    * When dealing with databases, operations like saving a user (user.save()) are typically asynchronous. This means that the operation does not complete immediately;
    */

   generateTokenAndSetCookie(res,user._id)//_id this is how mongoDB stores ids


   //now we can send a verification email
   await sendVerificationEmail(user.email, verificationToken)


   //next step is to prepare the response back to client
   res.status(201).json({
    success: true,
    message:"User Created Successfully",
    user:{
        //instead of spreading , just normally pass the data , but spread is cleaner
        
        ...user._doc,//spread the user document
        password:undefined
    }
    //send user without password
    //in the response we need to send the user back without the sensitive info , because the front end side needs this info to manage state
   })
}
   catch (error) {
    return res.status(400).json({success:false,message: error.message})
    //message: error.message message here could be any name , its an object i make , called the response object or response payload

   }
}//async

export const verifyEmail = async (req,res) =>{
    //first we need the code the user received from our email 
    const {code}=req.body//needed in front and postman
    // imagine the front end , after pressing a button after typing the code , a request would be sent to this endpoint , in its body , there is the code , we destructure it here 

    try {//template is async try (await inside try for any thing db related or a promise ) catch

        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt: {$gte: Date.now()}})
            //$gte is used in mongodb ,explanation below
            //verificationTokenExpiresAt is a date field , and we are checking if it is greater than or equal to current date

            if (!user) {
                throw new Error("Invalid or expired Verification Code")
            }
            //now that we found a user with such credentials , we update the is verified value , and remove the verification token and its expiration date, 
            //verification steps : 1- create a token upon signup , store it with it expiration date in db, 2- upon signup in backend an email is sent containing code , in front in upon sign up , route to verification page 3- user checks his email for the code  the backend sent, types in the page of verification , sending a requesto to verify-email endpoint , 4- backend checks for matching codes , if valid  , updates the user document in db , and removes the verification token and its expiration date .
            user.isVerified=true;

            user.verificationToken=undefined//clears value associated with the key
            user.verificationTokenExpiresAt=undefined

            await user.save()//update the values
            // now that the user is verified , we can send a welcome email

            await sendWelcomeEmail(user.email,user.name)

            //very important : dont forget to return a response , otherwise postman is stuck meaning api isnt functioning properly 
            res.status(200).json({success: true, message: "Email verified successfully",
                user:{//obj
                    ...user._doc,
                    password:undefined
                }
            })
        }


    
    catch (error) {
        return res.status(400).json({success: false, message: error.message})//in the controller functions a must prepare a response , either success or failure , this is the last step
    }

}

export const login = async (req, res) => {
    res.send("login page");
}

export const logout = async (req, res) => {
    res.send("logout page");
}



/**
 * Operations That Require await:
Database Operations:

CRUD operations using libraries like Mongoose.
Example: const user = await User.findById(userId);
Network Requests:

Making API calls with libraries like axios or using fetch.
Example: const response = await axios.get('https://api.example.com/data');
File System Operations:

Reading/writing files using Node.js fs.promises API.
Example: const data = await fs.readFile('file.txt', 'utf8');
Timers:

Creating delays with setTimeout wrapped in a Promise.
Example: await new Promise(resolve => setTimeout(resolve, 1000));
WebSocket Operations:

Awaiting connection establishment or message sending.
Example: await new Promise(resolve => ws.onopen = resolve);
Promise.all:

Handling multiple asynchronous operations concurrently.
Example: const [user, posts] = await Promise.all([User .findById(userId), Post.find({ userId })]);
Custom Promises:

Awaiting any custom function that returns a Promise.
Example: const result = await myAsyncFunction();
Event Listeners:

Awaiting events that return Promises.
Example: const result = await new Promise(resolve => someEventEmitter.on('event', resolve));
Conclusion:
Use await with any asynchronous operation that returns a Promise to improve readability and manage asynchronous code effectively.
 */

/**
 * Definition: $gte stands for "greater than or equal to" and is a comparison operator used in MongoDB queries.

Purpose: It allows you to filter documents based on whether a specified field's value is greater than or equal to a given value.

Syntax: The general format for using $gte in a query is:

javascript

Verify
Edit
Copy code
{
    fieldName: { $gte: value }
}
 */