import jwt from  'jsonwebtoken';

export const  generateTokenAndSetCookie = (res,userId)=>{

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
