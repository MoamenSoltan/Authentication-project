import {create} from "zustand"//its our state management solution
import axios from "axios"

const API_URL=import.meta.env.MODE==="development"? "http://localhost:5000/api/auth":"/api/auth"

//TODO: 
axios.defaults.withCredentials=true//very important , this modification allows us to put the cookies in the request header

//whats in this state is very important
//TODO: api calls functions are in this store (state management solution) and are always async
export const useAuthStore=create((set)=>({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    message:null,
    isCheckingAuth:true,//when refreshing the page we quickly check if the user is authenticated

    signup:async(email, password,name)=>{
        set({isLoading:true})
        //handle promises using try and catch , also a these requests (post and get ) return a response so we store it in a variable
        try {
           const response= await axios.post(`${API_URL}/signup`,{email,password,name})//معمولة بالشكل ده عشان ليهم نفس الاسم
        //    the response is returning userdata , check backend
        set({user:response.data.user,isAuthenticated:true,isLoading:false})
        } catch (error) {
            set({error:error.response.data.message||"Error signing up",isLoading:false})

            throw error;//to be handled in handleSubmit
        }
    },
    login:async(email,password)=>{
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${API_URL}/login`,{email,password});

            set({user:response.data.user,isAuthenticated:true,isLoading:false})
        } catch (error) {
            set({error:error.response.data.message|| "error logging in", isLoading:false})
            throw error;//to be handled in handleSubmit 
        }
    },
    logout: async()=>{
        set({isLoading:true,error:null})
        try {
            await axios.post(`${API_URL}/logout`)
            set({user:null,isAuthenticated:false,isLoading:false})
        } catch (error) {
            set({error:error.response.data.message||"Error logging out", isLoading:false})
    }},
    verifyEmail:async(code)=>{
        set({isLoading:true,error:null})
//TODO: very important : the code is sent as an object (eg. code:"123456") because this is how the backend expects  it

        try {
            const response = await axios.post(`${API_URL}/verify-email`,{code})
            set({user:response.data.user,isAuthenticated:true,isLoading:false})
            //TODO:
            return response.data
        } catch (error) {
            set({error:error.response.data.message||"Error verifying email",isLoading:false})

            throw error;//to be handled in handleSubmit
        }

    },
    //TODO: in a useEffect in APP.jsx
    checkAuth: async ()=>{
        // await new Promise((resolve)=>setTimeout(resolve,5000))
        //mimick loading
        set({isCheckingAuth:true})
        try {
            const response = await axios.get(`${API_URL}/check-auth`)
            set({user:response.data.user,isAuthenticated:true,isCheckingAuth:false,error:null}) 
        } catch (error) {
            console.error("Error during authentication check:", error);

            set({ 
                error: error?.response?.data?.message || "An unknown error occurred",
                isCheckingAuth: false,
                isAuthenticated: false 
            });
        }
    },//used in app.jsx for auth checking and protecting routes
    forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}))