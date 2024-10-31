import jwt from "jsonwebtoken"

// Middleware to verify JWT token
//linked with axios interceptors

export const verifyToken = async (req, res, next) => {
    //any request will be associated with this method , because the req has a token attached to cookies if the user is authenticated , axios interceptors are used with this method
    //compares the secret key to the one in environment variables
    //next means call checkAuth , in route params
  const token = req.cookies.token//we need the parser here to extract cookies

  if (!token) {
    return res.status(401).json({ success:false,message: "You are not authenticated" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = decoded.userId//after the token is decoded , we add a field in the request that holds the decoded value 
    //here we are modifying the request because its a middleware function , meaning that the the same request would be used more than once
    //we use the decoded value to search by id in checkAuth
    //we are extracting the id from jwt to ensure that the token in the request cookies holds an id that resembles a user in DB , note : the jwt token isnt stored in the DB , it can be stored in localstorage (weak security) or appended to cookies in each request
    if(!decoded){
        throw new Error("Invalid token")
    }
    next()
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}