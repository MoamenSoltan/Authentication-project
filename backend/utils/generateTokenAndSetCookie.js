import jwt from  'jsonwebtoken';

export const  generateTokenAndSetCookie = (res,userId)=>{
//the cookie is set to the response object
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    //userId:userId
    res.cookie('token', token, {
        httpOnly: true,//cannot be accessed by js only http//prevents xss attacks
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production,in local host its http , and in production its https
        maxAge: 7 * 24 * 60 * 60 * 1000 ,// 7 days in milliseconds
        sameSite:'strict'//prevents an attack called csrf

    });
    return token
    //no need to return res , because its given through the parent function (controller) and this function just sets the cookies to the res and returns a token
}
//setup cookies with tokens always

/**
 * You're spot on! Cookies are always set in HTTP responses (using res) and read from HTTP requests (using req). This is fundamental to how cookies work within the HTTP protocol.

Think of it as a conversation:

Client's Request (using req): "Hey server, I'd like to access this resource. Here are my cookies (if any) to prove I might have logged in before."
Server's Response (using res): "Okay, here's the resource you asked for. And by the way, I'm giving you this cookie to remember you for your next visit (e.g., for authentication)."
Why generateTokenAndSetCookie needs res:

Setting the Cookie: The server needs a way to include the generated authentication token (JWT in this case) in its response back to the client. It does this by setting a cookie using the res object (e.g., res.cookie('token', token, options)).
Why not req?

Request Purpose: The req object contains information sent by the client to the server. You wouldn't set a cookie on the client's request—it's the server's job to send the cookie back as part of the response.
Overwriting Issues: Modifying the client's request (req) directly could lead to unexpected behavior and is generally not a good practice in HTTP request handling.
In essence:

req: The server reads incoming cookies from the client's request to understand the client's state (like whether they are authenticated).
res: The server sets new or updated cookies on the response to send back to the client, which the client's browser then stores and sends in subsequent requests.
 */