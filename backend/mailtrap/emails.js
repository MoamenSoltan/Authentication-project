import { mailtrapClient, sender } from "./mailtrap.config.js"
import {VERIFICATION_EMAIL_TEMPLATE} from "./emailTemplates.js"


export const sendVerificationEmail = async (email,verificationToken)=>{
    const recipient = [{email}]//must be an array of objects

    try {
        const response = await mailtrapClient.send({
            from:sender,//demo domain
            to:recipient,
            subject:"Verify your email",
            html : VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email Verification"
            //in the template , we have this jsx line {verificationCode} , the replace puts the token instead of the code
        })//send is function commented in mailtrap config
        //a function that does some operation and returns a response which can be used to display useful info

        console.log("Email sent successfully",response);
        
    }
    catch (error) {
        console.error("Error sending verification",error)
        throw new Error(`error sending verification email ${error}`)
    }
}


export const sendWelcomeEmail= async(email,name) =>{
    const recipient = [{email}]
    
    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            
            template_uuid:"ded48849-1c1d-4340-8448-26ade08758d0",
            template_variables:{
                "company_info_name": "Moamens Company",
                "name": name
              },
            
        })
        console.log("Welcome Email sent successfully ",response);

        
    }
    catch (error){
        console.error("Error sending welcome email",error)
        throw new Error(`error sending welcome email ${error}`)//for the controller catch to trigger
    }
}


//async to not delay the program , we use await because it returns a promise , hence the use of try and catch , instead of .then() and .catch() // because it looks more like a synchronous code , meaning cleaner code

/**
 * Yes, the mailtrapClient.send() method is likely returning a Promise, which is why the await keyword is used in front of it. Let's break down the concepts related to Promises, async/await, and error handling in this context:

Promises
What is a Promise?:

A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. Promises can be in one of three states: pending, fulfilled, or rejected.
Using Promises with then and catch:

Typically, you handle Promises using the .then() method for successful resolution and .catch() for handling errors. However, with the introduction of async/await, you can write asynchronous code that looks more like synchronous code.
async/await
async Function:

When you define a function with the async keyword, it automatically returns a Promise. Within an async function, you can use the await keyword to wait for a Promise to resolve.
Using await:

The await keyword pauses the execution of the async function until the Promise is resolved or rejected. This allows you to write cleaner and more readable code without chaining .then() and .catch().
Error Handling with try/catch
Why Use try/catch?:
When you use await, if the Promise is rejected (i.e., an error occurs), it will throw an error. To handle this error gracefully, you can wrap the await call in a try/catch block. The catch block will catch any error thrown by the awaited Promise.
Storing the Response
Storing the Response:

The result of the mailtrapClient.send() method (which is a Promise) is stored in the variable response. This allows you to access the response data returned by the email-sending operation. This can include information about the success of the email sending, any metadata, or other relevant information provided by the Mailtrap API.
Why Store It?:

Storing the response can be useful for logging, debugging, or further processing. For example, in the provided code, the response is logged to the console to confirm that the email was sent successfully.
Summary
The mailtrapClient.send() method returns a Promise, which is why the await keyword is used.
The try/catch block is used to handle any errors that may occur when the Promise is rejected.
Storing the result of the send function in the response variable allows you to access the details of the email-sending operation, which can be useful for logging or further processing.
 */