import { Navigate, Route, Routes } from "react-router-dom"
import FloatingShape from "./components/FloatingShape"

import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import EmailVerification from "./pages/EmailVerification"

import {Toaster} from "react-hot-toast"
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react"
import DashboardPage from "./pages/DashboardPage"
import LoadingSpinner from "./components/LoadingSpinner"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
//TODO: protecting routes


//protect routes that require authentication

const ProtectedRoute =({children})=>{
  const {user,isAuthenticated}=useAuthStore()
  if(!isAuthenticated){
    return <Navigate to={"/login"} replace/>//only this component would be rendered 
  }// Navigate in a return statement
  if(!user.isVerified){
    return <Navigate to={"/verify-email"} replace/>
    // Navigate, not useNavigate()
  }
  return children//the protected route

  /**In Essence: The return statement acts as a switch. It determines which branch of logic should be executed and, therefore, what should be rendered based on the user's authentication and verification status. */
}

//TODO: redicrect already authenticated users
//redirect authenticated users to homepage
const RedirectAuthenticatedUser= ({children})=>{
  const {isAuthenticated,user}=useAuthStore()
  if(isAuthenticated &&user.isVerified) {
    return <Navigate to={"/"} replace/>
    // Navigate, not useNavigate() , in a return statement
  }
  return children//current page
}

function App() {
  //TODO: necessary to check all the time if the user is authenticated , dependecy could be just [] //on mount
  
  const {isCheckingAuth,checkAuth}=useAuthStore()
// TODO: simple function , just sends a get req to Back end , and receives a response containing user data
  useEffect(()=>{
    checkAuth()

  },[checkAuth])
 
  
  if (isCheckingAuth){

    return <LoadingSpinner/>
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
      <FloatingShape 
      color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0}
      />

      <FloatingShape 
      color="bg-green-500" size="w-48 h-48" top="70%" left="80%" delay={5}
      />
       <FloatingShape 
      color="bg-green-500" size="w-32 h-32" top="40%" left="-10%" delay={2}
      />

      <Routes>

          <Route path="/" element={<ProtectedRoute>
            <DashboardPage/>
          </ProtectedRoute>}/>
          <Route path="/signup" element={<RedirectAuthenticatedUser>
            <SignUpPage/>
          </RedirectAuthenticatedUser>}/>
          <Route path="/login" element={<RedirectAuthenticatedUser>
            <LoginPage/>
          </RedirectAuthenticatedUser>}/>
          <Route path="/verify-email" element={<EmailVerification/>}/>
          

          <Route path="/forgot-password" element={<RedirectAuthenticatedUser>
            <ForgotPasswordPage/>
          </RedirectAuthenticatedUser>}/>

          {/* TODO: dynamic segment , use useParams hook to destructure this value */}
          {/* how this dynamic segment works : we destructure the token , and password in frontend , send it in a req to the reset-password end point to the backend , the backend checks if there exists a user with the same token in their DB document (which is created and added to the user in forgot-password endpoint) , if so return a success  message ,and backend hashes the new password and saves it to user, if not return an error message, */}
          <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser>
            <ResetPasswordPage/>
          </RedirectAuthenticatedUser>}/>
          
          <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
